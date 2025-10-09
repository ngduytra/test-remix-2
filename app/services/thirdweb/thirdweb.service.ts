import axios, { AxiosInstance } from 'axios'
import {
  getContract,
  ThirdwebContract,
  isAddress,
  ZERO_ADDRESS,
} from 'thirdweb'
import { Abi } from 'thirdweb/utils'

import { client } from '@/configs/thirdweb.config'
import { supportChain } from '@/configs'

import {
  GetNFTOwnersByContractResponse as GetNFTOwnersResponse,
  GetNftsParams,
  GetNftsResponse,
  GetNftsTranfersParams,
  GetNftsTransfersResponse,
  ThirdwebList,
} from '@/types'

export class ThirdwebService {
  axios: AxiosInstance
  static instance: ThirdwebService

  constructor() {
    const headers: { [key: string]: string | undefined } = {
      'x-client-id': import.meta.env.VITE_THIRDWEB_CLIENT_ID,
    }

    this.axios = axios.create({
      baseURL: import.meta.env.VITE_THIRDWEB_API_URL,
      headers,
    })
  }

  async getNFTOwners(contractAddress: string, chainId: number) {
    const { data } = await this.axios.get<{
      data: GetNFTOwnersResponse[]
    }>(`/nfts/owners/${contractAddress}`, {
      params: {
        chain_id: chainId,
        include_balances: false,
      },
    })

    const ownerAddresses = data.data[0].owner_addresses
    const uniqueOwners = new Set(ownerAddresses)

    return Array.from(uniqueOwners)
  }

  async getNfts({
    ownerAddress,
    contractAddress,
    chainId,
    limit,
    page,
  }: GetNftsParams) {
    const { data } = await this.axios.get<{ data: GetNftsResponse[] }>(
      '/nfts',
      {
        params: {
          owner_address: ownerAddress,
          contract_address: contractAddress,
          chain_id: chainId,
          limit,
          page,
        },
      },
    )
    return data.data
  }

  async getNftsByContractAddress({
    contractAddress,
    chainId,
    limit,
    page,
  }: GetNftsParams) {
    const { data } = await this.axios.get<{ data: GetNftsResponse[] }>(
      `nfts/${contractAddress}`,
      {
        params: {
          chain_id: chainId,
          limit,
          page,
        },
      },
    )
    return data.data
  }

  async getNftTransfers({
    ownerAddress,
    contractAddress,
    chainId,
    transferType,
    timestampFrom,
  }: GetNftsTranfersParams) {
    const { data } = await this.axios.get<{
      data: ThirdwebList<GetNftsTransfersResponse>
    }>(`/nfts/transfers`, {
      params: {
        owner_address: ownerAddress,
        contract_address: contractAddress,
        chain_id: chainId,
        transfer_type: transferType,
        block_timestamp_from:
          timestampFrom ?? import.meta.env.VITE_BLOCK_TIMESTAMP_FROM,
        metadata: true,
      },
    })

    return data.data
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ThirdwebService()
    }
    return this.instance
  }
}

export function createThirdwebContract(
  contractAddress: string,
  abi: Abi,
): ThirdwebContract<any, `0x${string}`> {
  return getContract({
    client,
    chain: supportChain,
    address:
      contractAddress && isAddress(contractAddress)
        ? contractAddress
        : ZERO_ADDRESS,
    abi,
  })
}
