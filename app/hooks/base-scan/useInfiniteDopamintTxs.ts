import { useEffect, useState } from 'react'

import { useInfiniteTxsByTokenAddress } from './useInfiniteTransactions'

import { BaseScan } from '@/services/base-scan/base-scan.service'

import { GetAddressTxsRequest } from '@/types/blockscout/address-transaction.type'
import { DopamintEvent, TxType } from '@/types/dopamint-contract.type'
import { Transaction } from '@/types/blockscout/base-types/transaction'

export const useInfiniteDopamintTxs = (
  params: GetAddressTxsRequest & {
    txTypes?: TxType[]
  },
) => {
  const { transactions, ...rest } = useInfiniteTxsByTokenAddress(params)
  const [dopamintTxs, setDopamintTxs] = useState<Transaction[]>([])

  useEffect(() => {
    const processTxs = async () => {
      const processedTxs = await Promise.all(
        transactions.map(async (tx) => {
          if (tx.decoded_input?.method_call === TxType.burnNFT) {
            const txLogs = await BaseScan.getInstance().getTxLogs({
              txHash: tx.hash,
            })
            // Find the NFTBurned event log to get the refund value
            const burnEvent = txLogs.items.find((log: any) => {
              return log.decoded.method_call?.includes(DopamintEvent.NFTBurned)
            })

            if (burnEvent)
              tx.value =
                (burnEvent?.decoded?.parameters[2].value as string) || '0'
          }
          return tx
        }),
      )
      setDopamintTxs(processedTxs)
    }

    processTxs()
  }, [transactions])

  return {
    transactions: dopamintTxs,
    ...rest,
  }
}
