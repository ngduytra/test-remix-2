import { prepareContractCall } from 'thirdweb/transaction'
import { getContract, ThirdwebContract } from 'thirdweb'

import { BaseService } from '../base-service'

import { client } from '@/configs/thirdweb.config'
import { supportChain } from '@/configs/chain.config'
import { DopamintPaymentAbi } from '@/abi'

import { PaginatedResponse } from '@/types'
import {
  GetCheckoutCreatingCollectionTxParams,
  GetCollectionPriceCandlesRequest,
  GetCollectionPriceCandlesResponse,
  GetCollectionPriceBoundedCandlesResponse,
  GetCollectionResponse,
  GetCreatorParams,
  GetCreatorResponse,
  GetPaymentByIdResponse,
  GetInfiniteMarketCollectionsRequest,
} from './type'

export class FinanceService extends BaseService {
  static instance: FinanceService
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dopamintPaymentContract: ThirdwebContract<any, `0x${string}`>
  constructor() {
    super(import.meta.env.VITE_DOPAMINT_FINANCE_API)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.dopamintPaymentContract = getContract<any>({
      client,
      chain: supportChain,
      address: import.meta.env
        .VITE_DOPAMINT_PAYMENT_CONTRACT_ADDRESS as `0x${string}`,
      abi: DopamintPaymentAbi,
    })
  }

  getCheckoutCreatingCollectionTx(
    params: GetCheckoutCreatingCollectionTxParams,
  ) {
    return prepareContractCall({
      contract: this.dopamintPaymentContract,
      method: `function pay(uint256 genID, uint256 amount, bytes memory operatorSignMessage)`,
      params: [
        BigInt(params.genId),
        BigInt(params.amount),
        params.signature as `0x${string}`,
      ],
      value: BigInt(params.amount),
    })
  }

  async getPaymentById(paymentId: string) {
    const { data } = await this.axios.get<GetPaymentByIdResponse>(
      `/payment/${paymentId}`,
    )
    return data
  }

  async getMarketCollectionByContractAddress(contractAddress: string) {
    const { data } = await this.axios.get<GetCollectionResponse>(
      `/collections/${contractAddress}`,
    )
    return data
  }

  async getCollectionPriceCandles(
    contractAddress: string,
    params: GetCollectionPriceCandlesRequest,
  ) {
    const { data } = await this.axios.get<GetCollectionPriceCandlesResponse>(
      `/market/collections/${contractAddress}/candles`,
      {
        params,
      },
    )
    return data
  }

  async getCollectionPriceBoundedCandles(
    contractAddress: string,
    params: GetCollectionPriceCandlesRequest,
  ) {
    const { data } =
      await this.axios.get<GetCollectionPriceBoundedCandlesResponse>(
        `/market/collections/${contractAddress}/bounds`,
        {
          params,
        },
      )
    return data
  }

  async getCreators(params: GetCreatorParams) {
    const { data } = await this.axios.get<
      PaginatedResponse<GetCreatorResponse[]>
    >('/market/creators', {
      params,
    })
    return data
  }

  async getInfiniteMarketCollections(
    params: GetInfiniteMarketCollectionsRequest,
  ) {
    const { data } = await this.axios.get<
      PaginatedResponse<GetCollectionResponse[]>
    >('/collections', {
      params,
    })
    return data
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FinanceService()
    }
    return this.instance
  }
}
