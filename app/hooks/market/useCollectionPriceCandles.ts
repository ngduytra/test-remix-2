import { useQuery } from '@tanstack/react-query'

import { FinanceService } from '@/services/finance/finance.service'
import { GetCollectionPriceCandlesRequest } from '@/services/finance/type'

export const useCollectionPriceCandles = (
  contractAddress: string,
  params: GetCollectionPriceCandlesRequest,
) => {
  return useQuery({
    queryKey: ['collection-price-candles', contractAddress, params],
    queryFn: () =>
      FinanceService.getInstance().getCollectionPriceCandles(
        contractAddress,
        params,
      ),
    enabled: !!contractAddress,
  })
}
