import { AddressParam } from './addressParams'
import { TokenInfo } from './token'

export interface NftMetadataAttribute {
  trait_type: string
  value: string | number
  display_type?: string
}

export interface NftMetadata {
  name?: string
  description?: string
  image?: string
  image_url?: string
  home_url?: string
  external_url?: string
  year?: number
  tags?: string[]
  attributes?: NftMetadataAttribute[]
  [key: string]: any
}

export type NftInstance = {
  animation_url: string
  external_app_url: string
  id: string
  image_url: string
  is_unique: boolean
  media_type: string
  media_url: string
  metadata: NftMetadata | null
  owner: AddressParam
  thumbnails: string
  token: TokenInfo
}

// Enhanced NFT Instance Detail type that matches the provided JSON structure
export interface NftInstanceDetail {
  is_unique: boolean
  id: string
  holder_address_hash?: string
  image_url: string
  animation_url?: string | null
  external_app_url?: string | null
  metadata?: NftMetadata | null
  owner: AddressParam
  token: TokenInfo
}
