import { useReadContract } from 'thirdweb/react'
import { Address } from 'thirdweb'

import { createThirdwebContract } from '@/services/thirdweb/thirdweb.service'

import { NFTAbi } from '@/abi'

export type UseGetMintCostProps = {
  contractAddress: Address
  tokenId: string
}

export function useGetMintCost({
  contractAddress,
  tokenId,
}: UseGetMintCostProps) {
  const returnedData = useReadContract({
    contract: createThirdwebContract(contractAddress, NFTAbi),
    method: 'function tokenIdToMintCost(uint256) view returns (uint256)',
    params: [BigInt(tokenId)],
    queryOptions: {
      enabled: !!tokenId && !!contractAddress,
    },
  })

  return { ...returnedData }
}
