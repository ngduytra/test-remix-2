import { Transaction } from './base-types/transaction'
import { NFTTokenType, TokenType } from './base-types/token'
import { AddressNftCollection } from './base-types/addressNftCollection'
import { NftInstance } from './base-types/nftInstance'

export interface GetAddressTxsNextPageParams {
  block_number: number
  index: number
  items_count: number
}

export interface GetNFTCollectionNextPageParams {
  type: string
  token_type: TokenType
  token_contract_address_hash: string
  items_count: number
}

export interface GetNFTInstanceNextPageParams {
  unique_token: number
}

export type GetAddressTxsRequest = Partial<GetAddressTxsNextPageParams> & {
  address_hash: string
  filter?: 'from' | 'to'
}

export type GetAddressTxsResponse = {
  items: Array<Transaction>
  next_page_params: GetAddressTxsNextPageParams
}

export type GetNftCollectionsResponse = {
  items: Array<AddressNftCollection>
  next_page_params: GetNFTCollectionNextPageParams
}

export type GetTransactionInfoRequest = {
  address_hash: string
}

export type GetNftCollectionsRequest = {
  ownerAddress: string
  contractAddress: string
  type: string
}

export type GetNftInstancesRequest = {
  contractAddress?: string
  nextPageParam?: GetNFTInstanceNextPageParams | null
  limit: number
}

export type GetNftInstanceResponse = {
  items: Array<NftInstance>
  next_page_params: GetNFTInstanceNextPageParams | null
}

export type GetNftInstancesNextPageParams = {
  type: string
  token_type: string
  token_contract_address_hash: string
  token_id: string
  items_count: number
} | null

export type GetTokenHolderCount = {
  token_holders_count: string
  transfers_count: string
}

export type GetTransformedTokenHolderCount = {
  tokenHoldersCount: number
  transfersCount: number
}

// NFT Instance Detail Types
export interface GetNftInstanceDetailRequest {
  contractAddress: string
  tokenId: string
}

export interface NftMetadataAttribute {
  trait_type: string
  value: string | number
  display_type?: string
}

export interface GetNftInstanceDetailResponse {
  id: string
  token: {
    address_hash: string
    name: string
    symbol: string
    type: NFTTokenType
    holders: string
    total_supply: string
    exchange_rate?: string
  }
  owner: {
    hash: string
    ens_domain_name?: string
    is_contract?: boolean
    is_verified?: boolean
  }
  holder?: {
    hash: string
    ens_domain_name?: string
  }
  image_url: string
  animation_url?: string
  external_app_url?: string
  metadata?: {
    name?: string
    description?: string
    image?: string
    attributes?: NftMetadataAttribute[]
    properties?: Record<string, any>
  }
  is_unique?: boolean
}

export interface NextPageParamsGetNftInstanceTransfer {
  block_number: number
  index: number
  token_id: number
}

export interface GetNftInstanceTransfersRequest {
  contractAddress: string
  tokenId: string
  nextPageParams: NextPageParamsGetNftInstanceTransfer | null
}

export interface NftTransfer {
  tx_hash: string
  from: {
    hash: string
    ens_domain_name?: string
  }
  to: {
    hash: string
    ens_domain_name?: string
  }
  timestamp: string
  method?: string
  type: string
  total?: {
    value: string
    decimals: number
  }
  block_number: number
}

export interface GetNftInstanceTransfersResponse {
  items: NftTransfer[]
  next_page_params: NextPageParamsGetNftInstanceTransfer | null
}
