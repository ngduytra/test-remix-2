import { useQuery } from '@tanstack/react-query'

import { NFTService } from '@/services/nft/nft.service'

import { PaginationDto } from '@/types'

export const useFeaturedCollections = (params: PaginationDto) => {
  const { data, ...rest } = useQuery({
    queryKey: ['featured-collections', params],
    queryFn: () => NFTService.getInstance().getFeaturedCollections(params),
  })

  return {
    ...rest,
    data: data?.data ?? [],
    total: data?.total ?? 0,
  }
}
