import { useQuery } from '@tanstack/react-query'
import { NFTService } from '@/services/nft/nft.service'
import { GetCollectionsParams } from '@/services/nft/type'

export function useSearchCollections(searchTerm: string, enabled = true) {
  const searchParams: GetCollectionsParams = {
    search: searchTerm,
    limit: 6, // Limit results for search suggestions
    offset: 0
  }

  return useQuery({
    queryKey: ['nft-search-collections', searchTerm],
    queryFn: () => NFTService.getInstance().getCollections(searchParams),
    enabled: enabled && !!searchTerm && searchTerm.length >= 1, // Only search when there's at least 1 character
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  })
}