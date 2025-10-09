import { useInfiniteQuery } from '@tanstack/react-query'

import { FinanceService } from '@/services/finance/finance.service'
import { GetInfiniteMarketCollectionsRequest } from '@/services/finance/type'

import { DEFAULT_PAGE_SIZE } from '@/constants'

export const useInfiniteMarketCollections = (
  params: Omit<GetInfiniteMarketCollectionsRequest, 'offset'>,
) => {
  const limit = params.limit || DEFAULT_PAGE_SIZE

  const { data, ...rest } = useInfiniteQuery({
    queryKey: ['market-collections', params],
    queryFn: async ({ pageParam: { offset, limit } }) => {
      const { data, hasNext } =
        await FinanceService.getInstance().getInfiniteMarketCollections({
          ...params,
          offset,
          limit,
        })
      return {
        data,
        nextPageParams: hasNext ? { offset: offset + limit, limit } : undefined,
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPageParams,
    initialPageParam: {
      offset: 0,
      limit: limit,
    },
  })

  return {
    data: data?.pages.flatMap((page) => page.data) || [],
    ...rest,
  }
}
