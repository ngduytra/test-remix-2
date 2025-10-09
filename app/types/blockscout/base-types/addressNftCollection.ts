import { AddressParam } from './addressParams'
import { TokenInfo } from './token'

export type AddressNftInstanceCollection = {
  is_unique: boolean
  id: string
  holder_address_hash: string
  image_url: string
  animation_url: string
  external_app_url: string
  metadata: Record<string, any> | null
  owner: AddressParam
  token: any
  example: null
  token_type: string
  value: string
}

export type AddressNftCollection = {
  token: TokenInfo
  amount: string
  token_instances: Array<AddressNftInstanceCollection>
}
