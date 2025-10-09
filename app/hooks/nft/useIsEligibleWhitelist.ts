import { useQuery } from '@tanstack/react-query'
import { Address, getAddress, isAddress, readContract } from 'thirdweb'
import { StandardMerkleTree } from '@openzeppelin/merkle-tree'

import { createThirdwebContract } from '@/services/thirdweb/thirdweb.service'
import { Collection } from '@/services/nft/type'
import { NFTAbi } from '@/abi'

export interface OnchainWhitelistConfig {
  merkleRoot: `0x${string}`
  startTime: bigint
  endTime: bigint
  maxPerWallet: bigint
  maxNFTForWhitelist: bigint
}

interface UseIsEligibleWhitelistProps {
  collection?: Collection
  userAddress?: Address
}

interface WhitelistEligibilityResult {
  isEligible: boolean
  merkleProof: string[]
  isLoading: boolean
  error: Error | null
  whitelistConfig?: OnchainWhitelistConfig
  isWhitelistActive: boolean
  totalSupply: number
  whitelistUserBuyCount: number
  refetch: () => void
}

interface WhitelistData {
  isEligible: boolean
  merkleProof: string[]
}

async function fetchCsvFromS3(url: string): Promise<string[]> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.statusText}`)
  }

  const csvText = await response.text()
  const lines = csvText.trim().split('\n')
  const validAddresses: string[] = []

  // Start from 1 to skip header
  for (let i = 1; i < lines.length; i++) {
    const address = lines[i].split(',')[0].trim()
    const validAddress = isAddress(address) ? getAddress(address) : null
    if (validAddress) {
      validAddresses.push(validAddress)
    }
  }

  return validAddresses
}

function calculateMerkleProof(
  addresses: string[],
  userAddress: string,
  whitelistConfig?: {
    maxPerWallet: bigint
    maxNFTForWhitelist: bigint
    startTime: bigint
    endTime: bigint
  },
  collectionId?: string,
): WhitelistData {
  if (!addresses.length || !whitelistConfig || !collectionId) {
    return { isEligible: false, merkleProof: [] }
  }

  let checksumUserAddress: string
  try {
    checksumUserAddress = getAddress(userAddress)
  } catch {
    return { isEligible: false, merkleProof: [] }
  }

  if (!addresses.includes(checksumUserAddress)) {
    return { isEligible: false, merkleProof: [] }
  }

  const treeData = addresses.map((addr) => [
    collectionId,
    addr,
    whitelistConfig.maxPerWallet,
    whitelistConfig.maxNFTForWhitelist,
    whitelistConfig.startTime,
    whitelistConfig.endTime,
  ])

  const tree = StandardMerkleTree.of(
    treeData,
    ['uint256', 'address', 'uint256', 'uint256', 'uint256', 'uint256'],
    { sortLeaves: true }, // ✅ Must match contract creation
  )

  // Find proof for user address using exact match
  for (const [i, v] of tree.entries()) {
    if (v[1] === checksumUserAddress) {
      // v[1] is the address field
      const proof = tree.getProof(i)
      return { isEligible: true, merkleProof: proof }
    }
  }

  return { isEligible: false, merkleProof: [] }
}

// Fetch all whitelist data in one async function
async function fetchWhitelistEligibility(
  collection: Collection,
  userAddress: Address,
): Promise<WhitelistEligibilityResult> {
  const contract = createThirdwebContract(collection.contractAddress!, NFTAbi)

  // Fetch whitelist config and total supply in parallel
  const [whitelistUserBuyCountData, whitelistConfigData, totalSupplyData] =
    await Promise.all([
      readContract({
        contract,
        method:
          'function whitelistUserBuyCount(address) view returns (uint256)',
        params: [userAddress],
      }),
      readContract({
        contract,
        method:
          'function wlConfig() view returns (bytes32, uint256, uint256, uint256, uint256)',
      }),
      readContract({
        contract,
        method: 'function totalSupply() view returns (uint256)',
      }),
    ])

  const whitelistConfig: OnchainWhitelistConfig = {
    merkleRoot: whitelistConfigData[0],
    startTime: whitelistConfigData[1],
    endTime: whitelistConfigData[2],
    maxPerWallet: whitelistConfigData[3],
    maxNFTForWhitelist: whitelistConfigData[4],
  }

  const totalSupply = Number(totalSupplyData)
  const whitelistUserBuyCount = Number(whitelistUserBuyCountData)

  // Check if whitelist is active
  const now = BigInt(Math.floor(Date.now() / 1000))
  const timeBasedActive =
    now >= whitelistConfig.startTime && now <= whitelistConfig.endTime
  const maxNFTForWhitelist = Number(whitelistConfig.maxNFTForWhitelist)
  const quotaReached = totalSupply >= maxNFTForWhitelist
  const isWhitelistActive = timeBasedActive && !quotaReached

  // If whitelist period ended → public access
  if (!isWhitelistActive) {
    return {
      isEligible: true,
      merkleProof: [],
      isLoading: false,
      error: null,
      refetch: () => {},
      whitelistConfig,
      isWhitelistActive: false,
      totalSupply,
      whitelistUserBuyCount,
    }
  }

  // Fetch CSV and calculate merkle proof
  const addresses = await fetchCsvFromS3(
    collection?.whitelistConfigs?.whitelistUrl!,
  )
  const contractConfig = {
    maxPerWallet: whitelistConfig.maxPerWallet,
    maxNFTForWhitelist: whitelistConfig.maxNFTForWhitelist,
    startTime: whitelistConfig.startTime,
    endTime: whitelistConfig.endTime,
  }

  const whitelistData = calculateMerkleProof(
    addresses,
    userAddress,
    contractConfig,
    collection.collectionId,
  )

  // If not eligible from off-chain proof
  
  if (!whitelistData.isEligible) {
    return {
      isEligible: false,
      merkleProof: [],
      isLoading: false,
      error: null,
      refetch: () => {},
      whitelistConfig,
      isWhitelistActive: true,
      totalSupply,
      whitelistUserBuyCount,
    }
  }

  // Verify on-chain
  const isVerified = await readContract({
    contract,
    method:
      'function verifyClaimProof(address account, bytes32[] merkleProof) view returns (bool)',
    params: [userAddress, whitelistData.merkleProof as `0x${string}`[]],
  })

  return {
    isEligible: Boolean(isVerified),
    merkleProof: whitelistData.merkleProof,
    isLoading: false,
    error: null,
    refetch: () => {},
    whitelistConfig,
    isWhitelistActive: true,
    totalSupply,
    whitelistUserBuyCount,
  }
}

export function useIsEligibleWhitelist({
  collection,
  userAddress,
}: UseIsEligibleWhitelistProps): WhitelistEligibilityResult {
  const isEnabled = !!(
    collection?.whitelistConfigs?.whitelistUrl &&
    collection?.contractAddress &&
    collection?.collectionId &&
    userAddress &&
    isAddress(userAddress) &&
    isAddress(collection.contractAddress)
  )

  const query = useQuery({
    queryKey: [
      'whitelist-eligibility',
      collection?.contractAddress,
      collection?.whitelistConfigs?.whitelistUrl,
      collection?.collectionId,
      userAddress,
    ],
    queryFn: () => fetchWhitelistEligibility(collection!, userAddress!),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  })

  // Return default values when not enabled or loading
  if (!isEnabled || !query.data) {
    return {
      isEligible: !collection?.whitelistConfigs, // If no whitelist → public access, if has whitelist → false until checked
      merkleProof: [],
      isLoading: query.isLoading,
      error: query.error,
      refetch: query.refetch,
      isWhitelistActive: false,
      totalSupply: 0,
      whitelistUserBuyCount: 0,
    }
  }

  return {
    ...query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
