import axios, { AxiosInstance } from 'axios'

import { ZERO_ADDRESS } from 'thirdweb'

import {
  GetAddressTxsRequest,
  GetAddressTxsResponse,
  GetNftCollectionsRequest,
  GetNftCollectionsResponse,
  GetNftInstanceResponse,
  GetNftInstancesNextPageParams,
  GetNftInstancesRequest,
  GetTokenHolderCount,
  GetTransformedTokenHolderCount,
  GetNftInstanceDetailRequest,
  GetNftInstanceTransfersRequest,
  GetNftInstanceTransfersResponse,
} from '@/types/blockscout/address-transaction.type'

import {
  NftInstance,
  NftInstanceDetail,
} from '@/types/blockscout/base-types/nftInstance'
import { AddressNftCollection } from '@/types/blockscout/base-types/addressNftCollection'
import { TokenTransfer } from '@/types/blockscout/base-types/tokenTransfer'
import { TokenType } from '@/types/blockscout/base-types/token'
import { LogsResponseAddress } from '@/types/blockscout/base-types/log'

import { fetchUntilLimit } from '@/utils/blockscout.util'

export class BaseScan {
  axios: AxiosInstance
  static instance: BaseScan

  constructor() {
    this.axios = axios.create({
      baseURL: import.meta.env.VITE_BASE_SCAN_API_URL,
    })
  }

  async getTxByTokenAddress({ address_hash, ...params }: GetAddressTxsRequest) {
    const { data } = await this.axios.get<GetAddressTxsResponse>(
      `/addresses/${address_hash}/transactions`,
      { params },
    )
    return data
  }

  async getTxLogs({ txHash }: { txHash: string }) {
    const { data } = await this.axios.get<LogsResponseAddress>(
      `/transactions/${txHash}/logs`,
    )
    return data
  }

  async getNftCollections({
    ownerAddress,
    contractAddress,
    type,
  }: GetNftCollectionsRequest) {
    let items: AddressNftCollection | undefined
    let next_page_params:
      | GetNftCollectionsResponse['next_page_params']
      | null
      | undefined = undefined
    do {
      const params: {
        type: string
        token_contract_address_hash?: string
        token_type?: string
      } = {
        type,
      }
      if (next_page_params) {
        params.token_contract_address_hash =
          next_page_params.token_contract_address_hash
        params.token_type = next_page_params.token_type
      }
      const { data } = await this.axios.get<GetNftCollectionsResponse>(
        `/addresses/${ownerAddress}/nft/collections`,
        {
          params,
        },
      )
      next_page_params = data.next_page_params
      items = data.items.find((collection) => {
        return (
          collection.token.address_hash.toLowerCase() ===
          contractAddress.toLowerCase()
        )
      })
    } while (!items && !!next_page_params)

    return items
  }

  async getNftInstances({
    contractAddress,
    nextPageParam,
  }: GetNftInstancesRequest) {
    const { data } = await this.axios.get<GetNftInstanceResponse>(
      `/tokens/${contractAddress}/instances`,
      { params: { ...nextPageParam } },
    )
    return { items: data.items, next_page_params: data.next_page_params }
  }

  async getNftInstancesWithGuaranteedLimit({
    contractAddress,
    nextPageParam,
    limit = 20,
  }: GetNftInstancesRequest) {
    return fetchUntilLimit(
      this.getNftInstances.bind(this),
      (instance: NftInstance) => {
        return instance.owner.hash !== ZERO_ADDRESS
      },
      {
        contractAddress,
        limit,
        nextPageParam,
      },
      (instance: NftInstance) => ({
        unique_token: Number(instance.id),
      }),
    )
  }

  async getNftsByOwner(
    ownerAddress: string,
    nextPageParams?: any,
  ): Promise<{
    items: NftInstance[]
    nextPageParams?: any
    hasNextPage: boolean
  }> {
    const params: GetNftInstancesNextPageParams = nextPageParams
      ? nextPageParams
      : {
          type: 'ERC-721',
        }

    const { data } = await this.axios.get<GetNftInstanceResponse>(
      `/addresses/${ownerAddress}/nft`,
      {
        params,
      },
    )

    return {
      items: data.items || [],
      nextPageParams: data.next_page_params,
      hasNextPage: !!data.next_page_params,
    }
  }

  async getTokenHolderCounter(
    contractAddress: string,
  ): Promise<GetTransformedTokenHolderCount> {
    const { data } = await this.axios.get<GetTokenHolderCount>(
      `/tokens/${contractAddress}/counters`,
    )
    return {
      tokenHoldersCount: Number(data.token_holders_count),
      transfersCount: Number(data.transfers_count),
    }
  }

  async getNftInstanceDetail({
    contractAddress,
    tokenId,
  }: GetNftInstanceDetailRequest): Promise<NftInstanceDetail> {
    const { data } = await this.axios.get<NftInstanceDetail>(
      `/tokens/${contractAddress}/instances/${tokenId}`,
    )
    return data
  }

  async getNftInstanceTransfers({
    contractAddress,
    tokenId,
    nextPageParams,
  }: GetNftInstanceTransfersRequest): Promise<GetNftInstanceTransfersResponse> {
    const { data } = await this.axios.get<GetNftInstanceTransfersResponse>(
      `/tokens/${contractAddress}/instances/${tokenId}/transfers`,
      {
        params: nextPageParams ? nextPageParams : undefined,
      },
    )
    return data
  }

  async getTokenTransferByTxHash(txHash: string, type: TokenType) {
    const { data } = await this.axios.get<{ items: [TokenTransfer] }>(
      `/transactions/${txHash}/token-transfers`,
      { params: { type } },
    )
    return data
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new BaseScan()
    }
    return this.instance
  }
}
