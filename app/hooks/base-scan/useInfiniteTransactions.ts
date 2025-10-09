import { useCallback, useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

import { useGetAllCollectionAddresses } from '../nft/useGetAllCollectionAddresses'

import { BaseScan } from '@/services/base-scan/base-scan.service'

import {
  GetAddressTxsNextPageParams,
  GetAddressTxsRequest,
} from '@/types/blockscout/address-transaction.type'
import { ALL_TRANSACTION_TYPES } from '@/constants'
import { TxType } from '@/types/dopamint-contract.type'

export const useInfiniteTxsByTokenAddress = ({
  txTypes,
  ...params
}: GetAddressTxsRequest & {
  txTypes?: TxType[]
}) => {
  const { data: collectionAddresses } = useGetAllCollectionAddresses()

  const lowercasedCollectionAddresses = useMemo(
    () => collectionAddresses?.map((addr) => addr.toLowerCase()),
    [collectionAddresses],
  )
  const checkCollectionAddress = useCallback(
    (methodCall: TxType, address?: string) => {
      if (methodCall === TxType.createNFTContract) {
        const nftFactoryContract =
          import.meta.env.VITE_DOPAMINT_NFT_FACTORY_CONTRACT_ADDRESS.toLowerCase()
        return address === nftFactoryContract
      }
      return (
        lowercasedCollectionAddresses &&
        address &&
        lowercasedCollectionAddresses.includes(address)
      )
    },
    [lowercasedCollectionAddresses],
  )
  const { data, ...rest } = useInfiniteQuery({
    queryKey: [
      'GET_INFINITE_TRANSACTIONS',
      params,
      txTypes,
      lowercasedCollectionAddresses,
    ],
    queryFn: async ({
      pageParam,
    }: {
      pageParam?: GetAddressTxsNextPageParams
    }) => {
      const nextPage: GetAddressTxsNextPageParams | undefined = pageParam

      const { items, next_page_params } =
        await BaseScan.getInstance().getTxByTokenAddress({
          ...params,
          ...nextPage,
        })

      const filteredItems = items.filter((tx) => {
        if (!tx.decoded_input?.method_call) {
          return false
        }
        const methodCall = tx.decoded_input.method_call as TxType
        if (!txTypes || txTypes.length === 0) {
          return (
            ALL_TRANSACTION_TYPES.includes(methodCall) &&
            checkCollectionAddress(methodCall, tx.to?.hash.toLowerCase())
          )
        }
        return (
          txTypes.includes(methodCall) &&
          checkCollectionAddress(methodCall, tx.to?.hash.toLowerCase())
        )
      })

      return {
        data: filteredItems,
        nextPage: next_page_params as GetAddressTxsNextPageParams,
      }
    },
    getNextPageParam: (lastPage: {
      nextPage: GetAddressTxsNextPageParams | null
    }) => lastPage.nextPage,
    enabled: !!params.address_hash,
    initialPageParam: undefined,
  })

  const transactions = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  )

  return {
    transactions,
    ...rest,
  }
}
