import { useQuery } from '@tanstack/react-query'
import { NFTService } from '@/services/nft/nft.service'
import { Collection } from '@/services/nft/type'

export function useCollectionWithMarketData(collection: Collection | null) {
  return useQuery({
    queryKey: ['nft-collection-market-data', collection?.collectionId],
    queryFn: () => NFTService.getInstance().enhanceCollectionWithMarketData(collection!),
    enabled: !!collection,
    staleTime: 1000 * 30, // 30 seconds (pricing data changes frequently)
  })
}