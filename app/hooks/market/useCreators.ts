import { useQuery } from '@tanstack/react-query'

import { FinanceService } from '@/services/finance/finance.service'

import { GetCreatorParams } from '@/services/finance/type'

export const useCreators = (params: GetCreatorParams) => {
  const { data, ...rest } = useQuery({
    queryKey: ['get-creators', params],
    queryFn: () => FinanceService.getInstance().getCreators(params),
  })

  return {
    ...rest,
    data: data?.data ?? [],
    total: data?.total ?? 0,
  }
}
