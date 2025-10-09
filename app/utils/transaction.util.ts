import { TransactionFilter } from '@/constants'
import { TxType } from '@/types/dopamint-contract.type'

export const convertTxFilter = (filters: TransactionFilter[]): TxType[] => {
  return filters.map((filter) => {
    switch (filter) {
      case TransactionFilter.Created:
        return TxType.createNFTContract
      case TransactionFilter.Minted:
        return TxType.mintNFT
      case TransactionFilter.Sold:
        return TxType.burnNFT
    }
  })
}
