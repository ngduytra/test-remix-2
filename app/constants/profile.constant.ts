import { TxType } from '@/types/dopamint-contract.type'

export enum TabType {
  Overviews = 'Overviews',
  Transactions = 'Transactions',
  // Analysis = 'Analysis', // TODO: enable this later
}

export enum TransactionFilter {
  Minted = 'Minted',
  Created = 'Created',
  Sold = 'Sold',
}

export const ALL_TRANSACTION_TYPES = [
  TxType.mintNFT,
  TxType.burnNFT,
  TxType.createNFTContract,
]

export const DEFAULT_TAB = TabType.Overviews
