import { useQuery } from '@tanstack/react-query'

import { coinPriceService } from '@/services'

import {
  TokenCoingeckoId,
  TokenSymbol,
} from '@/constants'

export const useGetCoinUsdPrice = (token?: TokenSymbol) => {
  const coingeckoId = token ? TokenCoingeckoId[token] : ''

  const { data, ...rest } = useQuery({
    queryKey: ['usdPrice', token],
    queryFn: () => coinPriceService.fetchUsdPrice(coingeckoId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token,
  })

  return { data: data?.[coingeckoId]?.usd ?? 0, ...rest }
}
