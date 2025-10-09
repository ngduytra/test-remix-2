import { useQuery } from '@tanstack/react-query'
import { NFTService } from '@/services/nft/nft.service'

export function useEnhancedCollectionByContract(contractAddress: string | null) {
  return useQuery({
    queryKey: ['nft-enhanced-collection-by-contract', contractAddress],
    queryFn: async () => {
      const nftService = NFTService.getInstance()
      const collection = await nftService.getCollectionByContractAddress(contractAddress!)
      return nftService.enhanceCollectionWithMarketData(collection)
    },
    enabled: !!contractAddress,
    staleTime: 1000 * 60 * 2, // 2 minutes (shorter due to dynamic pricing)
  })
}