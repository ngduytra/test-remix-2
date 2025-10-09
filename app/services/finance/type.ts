import {
  PaymentStatus,
  Timeframe,
  PaginationDto,
  OHLCV,
  MarketSortBy,
} from '@/types'
import { OrderDirection } from '../nft/type'

export type GetCheckoutCreatingCollectionTxParams = {
  genId: string
  signature: string
  amount: string
}

export type GetPaymentByIdResponse = {
  _id: string
  uid: string
  wallet: string
  genId: string
  token: string
  amount: string
  signature: string
  status: PaymentStatus
  txHash?: string
}

export type GetCollectionResponse = {
  address: string
  collectionId: string
  creatorAddress: string
  totalSupply: number
  currentPrice: string
  volumeAllTime: string
  volume24h: string
  creatorEarning: number
  lastTrade?: string
  lastSyncTimestamp: number
  createdAt: string
  updatedAt: string
}

export type GetCollectionPriceCandlesRequest = {
  timeframe: Timeframe
  from?: string
  to?: string
}

export type GetCollectionPriceCandlesResponse = OHLCV[]

export type GetCollectionPriceBoundedCandlesResponse = {
  leftBounded: OHLCV | null
  rightBounded: OHLCV | null
}

export type GetCreatorParams = PaginationDto & {
  sortBy?: 'totalEarning' | 'totalCollections' | 'totalNFTs'
  sortOrder?: OrderDirection
  address?: string
}

export type GetCreatorResponse = {
  address: string
  totalEarning: string
  totalCollections: number
  totalNFTs: number
  lastSyncTimestamp: number
  createdAt: string
  updatedAt: string
}

export type GetInfiniteMarketCollectionsRequest = PaginationDto & {
  sortBy?: MarketSortBy
  sortOrder?: OrderDirection
}
