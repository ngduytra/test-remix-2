import { useQuery } from '@tanstack/react-query'

import { FinanceService } from '@/services/finance/finance.service'
import { GetCollectionPriceCandlesRequest } from '@/services/finance/type'

export const useCollectionPriceBoundedCandles = (
  contractAddress: string,
  params: GetCollectionPriceCandlesRequest,
) => {
  return useQuery({
    queryKey: ['collection-price-bounded-candles', contractAddress, params],
    queryFn: () =>
      FinanceService.getInstance().getCollectionPriceBoundedCandles(
        contractAddress,
        params,
      ),
    enabled: !!contractAddress,
  })
}
