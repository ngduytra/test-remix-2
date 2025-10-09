import { OnchainWhitelistConfig } from '@/hooks/nft/useIsEligibleWhitelist'

export enum CollectionStatus {
  Active = 'status::active',
  Draft = 'status::draft',
}

export enum CollectionSortField {
  CreatedAt = 'createdAt',
  Name = 'name',
  Owner = 'owner',
  WhitelistEndtime = 'whitelistEndTime',
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export interface Collection {
  name: string
  description: string
  baseURI?: string
  owner: string
  promptId: string
  collectionId: string
  contractAddress: string
  status: CollectionStatus
  priority: number
  createdAt: string
  updatedAt: string
  whitelistConfigs: WhitelistConfig
  socials?: {
    x?: string
    telegram?: string
    website?: string
  }
}

export type WhitelistConfig = {
  whitelistUrl: string
  merkleRoot: string
  startTime: number
  endTime: number
  maxPerWallet: number
  maxNFTForWhitelist: number
}

export interface CollectionWithMarketData extends Collection {
  price: bigint
  change: number
  images: string[]
  supply: number
  holderCounter: number
}

export interface GetCollectionsParams {
  offset?: number
  limit?: number
  search?: string
  sortBy?: CollectionSortField
  sortOrder?: OrderDirection
  status?: CollectionStatus
  owner?: string
  contractAddress?: string
  createdAfter?: string
  createdBefore?: string
  hasWhitelist?: boolean
}

export interface GetCollectionsResponse {
  data: Collection[]
  total: number
  limit: number
  offset: number
  hasNext: boolean
  hasPrev: boolean
}

export interface GetCollectionResponse extends Collection {}

export type CreateCollectionParams = {
  name: string
  symbol: string
  collectionId: string
  tokenBaseURI: string
  mintTo: string
  whitelist: OnchainWhitelistConfig
}
export interface SlippageConfig {
  tolerance: number
  maxPrice: bigint
  deadline: number
}

export interface UserNFT {
  tokenId: bigint
  metadata?: {
    name?: string
    description?: string
    image?: string
    attributes?: Array<{
      trait_type: string
      value: string | number
    }>
  }
  lastSalePrice?: bigint
}

export type NftMetadata = {
  image: string
  tokenId: number
  name: string
  description: string
}
