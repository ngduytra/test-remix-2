export enum MarketSortBy {
  VOLUME_24H = 'volume24h',
  VOLUME_ALL_TIME = 'volumeAllTime',
  CREATOR_EARNING = 'creatorEarning',
  LAST_TRADE = 'lastTrade',
  CREATED_AT = 'createdAt',
  TOTAL_SUPPLY = 'totalSupply',
  CURRENT_PRICE = 'currentPrice',
}

export enum Timeframe {
  HalfHour = '30m',
  FourHours = '4h',
  OneDay = '1d',
  ThreeDays = '3d',
  OneWeek = '1w',
}

export enum TimeRange {
  OneDay = '1d',
  OneWeek = '1w',
  OneMonth = '1M',
  ThreeMonths = '3M',
  HalfYear = '6M',
  AllTime = 'All',
}

export type OHLCV = {
  time: string
  open: string
  high: string
  low: string
  close: string
  volume: string
}
