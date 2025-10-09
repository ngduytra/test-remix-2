import { useInfiniteQuery } from '@tanstack/react-query'
import { NFTService } from '@/services/nft/nft.service'
import {
  GetCollectionsParams,
  GetCollectionsResponse,
} from '@/services/nft/type'

interface UseInfiniteCollectionsParams
  extends Omit<GetCollectionsParams, 'offset'> {
  limit?: number
}

export function useInfiniteCollections(params?: UseInfiniteCollectionsParams) {
  const limit = params?.limit || 20

  const { data, ...rest } = useInfiniteQuery({
    queryKey: ['nft-infinite-collections', { ...params, limit }],
    queryFn: ({ pageParam = 0 }) =>
      NFTService.getInstance().getCollections({
        ...params,
        offset: pageParam,
        limit,
      }),
    getNextPageParam: (lastPage: GetCollectionsResponse) => {
      return lastPage.hasNext ? lastPage.offset + lastPage.limit : undefined
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

  return {
    data: data?.pages.flatMap((page) => page.data) || [],
    ...rest,
  }
}

export function useInfiniteEnrichedCollections(
  params?: UseInfiniteCollectionsParams,
) {
  const limit = params?.limit || 20

  return useInfiniteQuery({
    queryKey: ['nft-infinite-enriched-collections', { ...params, limit }],
    queryFn: ({ pageParam = 0 }) =>
      NFTService.getInstance().getEnrichedCollections({
        ...params,
        offset: pageParam,
        limit,
      }),
    getNextPageParam: (lastPage: any) => {
      return lastPage.hasNext ? lastPage.offset + lastPage.limit : undefined
    },

    initialPageParam: 0,
    staleTime: 1000 * 60 * 1, // 1 minute
  })
}
