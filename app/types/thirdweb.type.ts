import { Address } from 'thirdweb'

export type GetNFTOwnersByContractResponse = {
  chain_id: string
  owner_addresses: string[]
}

export type Contract = {
  address: Address
  chain_id: number
  name: string
  symbol: string
  type: 'erc721' | 'erc1155'
}

export type Attribute = {
  trait_type: string
  value: string
  display_type?: string
}

export type Property = Record<string, string>

export type ExtraMetadata = {
  attributes: Attribute[]
  properties: Property
}

export type Collection = {
  banner_image_url: string
  description: string
  external_link: string
  featured_image_url: string
  image_url: string
  name: string
}

export type GetNftsResponse = {
  balance: string
  chain_id: number
  contract_address: Address
  token_id: string
  token_type: string
  animation_url: string
  background_color: string
  collection: Collection
  contract: Contract
  description: string
  external_url: string
  extra_metadata: ExtraMetadata
  image_url: string
  metadata_url: string
  name: string
  owner_addresses: string[]
  status: string
  video_url: string
}

export type GetNftsParams = {
  ownerAddress?: string
  contractAddress?: string
  chainId: number
  limit?: number
  page?: number
}

export type GetNftsTranfersParams = {
  ownerAddress?: string
  contractAddress?: string
  chainId: number
  transferType: TransferType
  timestampFrom?: number
}

export type TransferType = 'mint' | 'transfer' | 'burn' | 'sale'

export type GetNftsTransfersResponse = {
  amount: string
  block_number: string
  block_timestamp: string
  chain_id: number
  contract_address: string
  from_address: string
  log_index: number
  to_address: string
  token_id: string
  token_type: 'erc721' | 'erc1155'
  transaction_hash: string
  transfer_type: TransferType
  block_hash: string
  nft_metadata: TransferNftMedata
  nft_sale: any
}

export type ThirdwebList<T> = {
  data: T[]
  meta: {
    page: number
    limit: number
    total_items: number
    total_pages: number
  }
}

export type TransferNftMedata = {
  animation_url: string
  background_color: string
  collection: Collection
  contract: Contract
  description: string
  external_url: string
  extra_metadata: ExtraMetadata
  image_url: string
  metadata_url: string
  name: string
  owner_addresses: string[]
  status: string
  video_url: string
}

export type GetNftsTransfersByTxsParams = {
  transactionHash: string
  chainId: number
}

export type NftTransferByTransactionResponse = {
  token_id: string
  from_address: string
  to_address: string
  contract_address: string
  block_number: string
  block_timestamp: string
  log_index: string
  transaction_hash: string
  transfer_type: TransferType
  chain_id: number
  token_type: 'erc721' | 'erc1155'
  amount: string
  nft_metadata: TransferNftMedata
}
