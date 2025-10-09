import { BaseService } from '../base-service'
import { BigNumber } from 'bignumber.js'
import {
  getContract,
  ThirdwebContract,
  readContract,
  ZERO_ADDRESS,
  prepareContractCall,
  Address,
  waitForReceipt,
  parseEventLogs,
  prepareEvent,
} from 'thirdweb'
import { getNFT } from 'thirdweb/extensions/erc721'
import { client } from '@/configs/thirdweb.config'
import { supportChain } from '@/configs/chain.config'
import axios from 'axios'

import { createThirdwebContract } from '../thirdweb/thirdweb.service'
import { BaseScan } from '../base-scan/base-scan.service'

import { NFTAbi, NFTFactoryAbi } from '@/abi'
import { pause } from '@/utils'
import { DEPLOY_COLLECTION_PRICE } from '@/constants'
import {
  Collection,
  CollectionWithMarketData,
  GetCollectionsParams,
  GetCollectionsResponse,
  GetCollectionResponse,
  CreateCollectionParams,
  NftMetadata,
  WhitelistConfig,
  CollectionStatus,
} from './type'
import { PaginatedResponse, PaginationDto } from '@/types'

// Constants
const DEFAULT_ETH_PRICE = 0n
const MINT_QUANTITY = 1n

// Contract method signatures
export const CONTRACT_METHODS = {
  ESTIMATE_COST_MINT:
    'function estimateCostMintNFT(uint256) view returns (uint256, uint256, uint256)',
  GET_BURN_REFUND_CURRENT:
    'function getBurnRefundCurrent() view returns (uint256, uint256, uint256)',
  GET_POOL_INFO:
    'function getPoolInfo() view returns (uint256, uint256, uint256, uint256)',
  TOTAL_SUPPLY: 'function totalSupply() view returns (uint256)',
  MAX_SUPPLY: 'function MAX_SUPPLY() view returns (uint256)',
  BALANCE_OF: 'function balanceOf(address) view returns (uint256)',
  GET_FEE_INFO: 'function getFeeInfo() view returns (uint256, uint256)',
  MINT_NFT:
    'function mintNFT(address, uint256, uint256[], bytes32[]) payable returns (uint256[])',
  CREATE_NFT_CONTRACT: {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_symbol',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_tokenBaseURI',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_collectionId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_mintTo',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'merkleRoot',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxPerWallet',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxNFTForWhitelist',
            type: 'uint256',
          },
        ],
        internalType: 'struct DopamintNFT.WhiteListConfig',
        name: 'wlConfig',
        type: 'tuple',
      },
    ],
    name: 'createNFTContract',
    outputs: [
      {
        internalType: 'address',
        name: 'newContract',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  GET_WHITELIST_CONFIG: {
    inputs: [],
    name: 'wlConfig',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'merkleRoot',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'endTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxPerWallet',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxNFTForWhitelist',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  BURN_NFT: 'function burnNFT(uint256[])',
} as const

export class NFTService extends BaseService {
  static instance: NFTService
  nftFactoryContract: ThirdwebContract<any, `0x${string}`>

  constructor() {
    super(import.meta.env.VITE_DOPAMINT_NFT_API)
    this.nftFactoryContract = getContract<any>({
      client,
      address: import.meta.env.VITE_DOPAMINT_NFT_FACTORY_CONTRACT_ADDRESS,
      chain: supportChain,
      abi: NFTFactoryAbi,
    })
  }

  async getCollections(params?: GetCollectionsParams) {
    const searchParams = new URLSearchParams()
    const flatParams = (params ?? {}) as Record<string, unknown>

    Object.entries(flatParams).forEach(([key, value]) => {
      if (value === undefined) return
      searchParams.append(key, String(value))
    })

    const { data } = await this.axios.get<GetCollectionsResponse>(
      `/collections?${searchParams.toString()}`,
    )
    return data
  }

  async getCollectionByContractAddress(contractAddress: string) {
    const { data } = await this.axios.get<GetCollectionResponse>(
      `/collections/by-address/${contractAddress}`,
    )
    return data
  }

  async getTotalSupply(contractAddress: string) {
    return await readContract({
      contract: this.createThirdwebContract(contractAddress),
      method: CONTRACT_METHODS.TOTAL_SUPPLY,
    })
  }

  private createThirdwebContract(
    contractAddress: string,
  ): ThirdwebContract<any, `0x${string}`> {
    return getContract({
      client,
      address: contractAddress,
      chain: supportChain,
    })
  }

  private async fetchCurrentMintPrice(
    contract: ThirdwebContract,
  ): Promise<bigint> {
    const estimateResult = await readContract({
      contract,
      method: CONTRACT_METHODS.ESTIMATE_COST_MINT,
      params: [MINT_QUANTITY],
    })

    if (estimateResult && estimateResult[0] > 0n) {
      const totalPrice = estimateResult[0] // First return value is totalPrice
      return totalPrice
    }

    // Fallback to default
    return DEFAULT_ETH_PRICE
  }

  private async calculatePriceChange(
    contract: ThirdwebContract,
  ): Promise<number> {
    const burnRefundResult = await readContract({
      contract,
      method: CONTRACT_METHODS.GET_BURN_REFUND_CURRENT,
      params: [],
    })
    const estimateResult = await readContract({
      contract,
      method: CONTRACT_METHODS.ESTIMATE_COST_MINT,
      params: [MINT_QUANTITY],
    })

    const refundWei = burnRefundResult?.[0] as bigint
    const priceWei = estimateResult?.[0] as bigint

    if (!refundWei || !priceWei || priceWei === 0n) return 0

    const refundBN = new BigNumber(refundWei.toString())
    const priceBN = new BigNumber(priceWei.toString())
    if (priceBN.isZero()) return 0

    return refundBN.dividedBy(priceBN).minus(1).multipliedBy(100).toNumber()
  }

  async getWhitelistConfig(collectionAddresss: string) {
    const contract = createThirdwebContract(
      collectionAddresss as Address,
      NFTAbi,
    )
    const data = await readContract({
      contract,
      method: CONTRACT_METHODS.GET_WHITELIST_CONFIG,
    })

    return {
      merkleRoot: data[0],
      startTime: Number(data[1]),
      endTime: Number(data[2]),
      maxPerWallet: Number(data[3]),
      maxNFTForWhitelist: Number(data[4]),
    }
  }

  async enhanceCollectionWithMarketData(
    collection: Collection,
  ): Promise<CollectionWithMarketData> {
    if (!this.hasValidContractAddress(collection)) {
      return this.createFallbackCollection(collection)
    }

    const contract = createThirdwebContract(
      collection.contractAddress! as Address,
      NFTAbi,
    )

    // Fetch pricing data
    const currentPrice = await this.fetchCurrentMintPrice(contract)
    const priceChange = await this.calculatePriceChange(contract)
    // Fetch collection image from NFT metadata
    const images = await Promise.all(
      [0n, 1n, 2n, 3n].map(async (tokenId) => {
        try {
          const metadata = await this.getNftMetadataByBaseUri(
            collection.baseURI!,
            tokenId.toString(),
          )
          return metadata.image
        } catch {
          return ''
        }
      }),
    )
    const currentSupply = await this.getTotalSupply(collection.contractAddress!)
    const tokenHolderCounter =
      await BaseScan.getInstance().getTokenHolderCounter(
        collection.contractAddress!,
      )

    return {
      ...collection,
      images: images.filter((image) => !!image),
      price: currentPrice,
      change: priceChange,
      supply: Number(currentSupply),
      holderCounter: tokenHolderCounter.tokenHoldersCount,
    }
  }

  private hasValidContractAddress(collection: Collection): boolean {
    return (
      !!collection.contractAddress &&
      collection.contractAddress !== ZERO_ADDRESS
    )
  }

  private createFallbackCollection(
    collection: Collection,
  ): CollectionWithMarketData {
    return {
      ...collection,
      images: [],
      price: DEFAULT_ETH_PRICE,
      change: 0,
      supply: 0,
      holderCounter: 0,
    }
  }

  async enrichCollectionsWithMarketData(
    collections: Collection[],
  ): Promise<CollectionWithMarketData[]> {
    return Promise.all(
      collections.map((collection) =>
        this.enhanceCollectionWithMarketData(collection),
      ),
    )
  }

  async getEnrichedCollections(params?: GetCollectionsParams): Promise<{
    data: CollectionWithMarketData[]
    total: number
    limit: number
    offset: number
    hasNext: boolean
    hasPrev: boolean
  }> {
    const response = await this.getCollections(params)
    const enrichedCollections = await this.enrichCollectionsWithMarketData(
      response.data,
    )

    return {
      ...response,
      data: enrichedCollections,
    }
  }

  async createCollection(collection: CreateCollectionParams) {
    const { name, symbol, tokenBaseURI, collectionId, mintTo, whitelist } =
      collection

    return prepareContractCall({
      contract: this.nftFactoryContract,
      method: CONTRACT_METHODS.CREATE_NFT_CONTRACT,
      params: [
        name,
        symbol,
        tokenBaseURI,
        BigInt(collectionId),
        mintTo,
        whitelist,
      ],
      value: DEPLOY_COLLECTION_PRICE,
    })
  }

  async estimateMintCost(
    contractAddress: string,
    quantity: number,
  ): Promise<{
    price: bigint
    protocolFee: bigint
    creatorFee: bigint
    totalPrice: bigint
  }> {
    const contract = this.createThirdwebContract(contractAddress)

    const result = await readContract({
      contract,
      method: CONTRACT_METHODS.ESTIMATE_COST_MINT,
      params: [BigInt(quantity)],
    })

    const [price, protocolFee, creatorFee] = result as [bigint, bigint, bigint]
    return {
      price,
      protocolFee,
      creatorFee,
      totalPrice: price + protocolFee + creatorFee,
    }
  }

  async getNftByIds(
    contractAddress: string,
    tokenIds: number[],
  ): Promise<any[]> {
    try {
      const contract = getContract({
        client,
        address: contractAddress,
        chain: supportChain,
        abi: NFTAbi,
      })

      // Fetch all NFTs concurrently
      const nftPromises = tokenIds.map(async (tokenId) => {
        try {
          const nftData = await getNFT({
            contract,
            tokenId: BigInt(tokenId),
          })

          return {
            id: tokenId,
            name: nftData.metadata.name || `NFT #${tokenId}`,
            image: nftData.metadata.image || '',
            tokenId: tokenId,
            contractAddress: contractAddress,
            chainId: supportChain.id,
            metadata: nftData.metadata,
          }
        } catch (error) {
          console.warn(`Failed to fetch NFT ${tokenId}:`, error)
          // Return fallback data if individual NFT fetch fails
          return {
            id: tokenId,
            name: `NFT #${tokenId}`,
            image: '',
            tokenId: tokenId,
            contractAddress: contractAddress,
            chainId: supportChain.id,
          }
        }
      })

      const nfts = await Promise.all(nftPromises)
      return nfts
    } catch (error) {
      console.error('Failed to fetch NFTs by IDs:', error)
      // Return fallback data for all NFTs if batch fetch fails
      return tokenIds.map((tokenId) => ({
        id: tokenId,
        name: `NFT #${tokenId}`,
        image: '',
        tokenId: tokenId,
        contractAddress: contractAddress,
        chainId: supportChain.id,
      }))
    }
  }

  async mintNFTWithTokenIds(params: {
    contractAddress: string
    quantity: number
    slippageTolerance: number
    userAddress: string
    sendTransactionAsync: any
    generateIds?: bigint[]
    merkleProof?: `0x${string}`[]
  }): Promise<number[]> {
    const {
      contractAddress,
      quantity,
      slippageTolerance,
      userAddress,
      sendTransactionAsync,
      generateIds = [],
      merkleProof = [],
    } = params

    const { totalPrice } = await this.estimateMintCost(
      contractAddress,
      quantity,
    )
    const maxPrice = this.calculateSlippagePrice(totalPrice, slippageTolerance)

    const contract = getContract({
      client,
      address: contractAddress,
      chain: supportChain,
      abi: NFTAbi,
    })

    const transaction = prepareContractCall({
      contract,
      method: CONTRACT_METHODS.MINT_NFT,
      params: [userAddress, BigInt(quantity), generateIds, merkleProof],
      value: maxPrice,
    })

    // Use the sendTransactionAsync from the hook
    const result = await sendTransactionAsync(transaction)
    const receipt = await waitForReceipt(result)
    await pause(3)

    // Prepare the NFTMinted event for parsing
    const nftMintedEvent = prepareEvent({
      signature:
        'event NFTMinted(address indexed to, uint256 indexed tokenId, uint256 price, uint256 protocolFee, uint256 creatorFee)',
    })

    // Parse NFTMinted events to get the minted tokenIds
    const mintedEvents = parseEventLogs({
      logs: receipt.logs,
      events: [nftMintedEvent],
    })

    // Extract tokenIds from parsed events
    const tokenIds: number[] = mintedEvents.map((event: any) =>
      Number(event.args.tokenId),
    )

    return tokenIds
  }

  async getSellNftTransaction(params: {
    contractAddress: string | Address
    tokenId: string
  }) {
    const { contractAddress, tokenId } = params
    return prepareContractCall({
      contract: createThirdwebContract(contractAddress as Address, NFTAbi),
      method: CONTRACT_METHODS.BURN_NFT,
      params: [[BigInt(tokenId)]],
    })
  }

  async getNftMetadataByBaseUri(baseUri: string, tokenId: string) {
    const trimmedBaseUri = baseUri.endsWith('/') ? baseUri : `${baseUri}/`
    const { data } = await axios.get<NftMetadata>(trimmedBaseUri + tokenId)
    return data
  }

  async uploadWhitelistCsv(
    collectionId: string,
    csvFile: File,
    whitelistData: Omit<WhitelistConfig, 'whitelistUrl'>,
  ) {
    const formData = new FormData()
    formData.append('file', csvFile)
    Object.entries(whitelistData).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    const { data } = await this.axios.post<string>(
      `/collections/${collectionId}/whitelist`,
      formData,
    )
    return data
  }

  private calculateSlippagePrice(
    totalPrice: bigint,
    slippageTolerance: number,
  ): bigint {
    const slippageMultiplier = BigInt(
      Math.floor((100 + slippageTolerance) * 100),
    )
    return (totalPrice * slippageMultiplier) / BigInt(10000)
  }

  async getFeaturedCollections(params: PaginationDto) {
    const { data } = await this.axios.get<PaginatedResponse<Collection[]>>(
      '/collections/featured',
      {
        params,
      },
    )
    return data
  }

  async getAllCollectionAddresses(
    ownerAddress?: string,
    nextPageParams?: PaginationDto,
  ) {
    const { data } = await this.axios.get<
      PaginatedResponse<{ contractAddress: string }[]>
    >('/collections/all-addresses', {
      params: {
        owner: ownerAddress,
        status: CollectionStatus.Active,
        ...nextPageParams,
      },
    })
    return data
  }

  static getInstance() {
    if (!NFTService.instance) {
      NFTService.instance = new NFTService()
    }
    return NFTService.instance
  }
}
