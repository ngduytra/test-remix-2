import { useQuery } from '@tanstack/react-query'

import { FinanceService } from '@/services/finance/finance.service'

export function useMarketCollectionByContractAddress(contractAddress?: string) {
  return useQuery({
    queryKey: ['get-market-collection-by-contract', contractAddress],
    queryFn: () =>
      FinanceService.getInstance().getMarketCollectionByContractAddress(
        contractAddress!,
      ),
    enabled: !!contractAddress,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
