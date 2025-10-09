import { useQuery } from '@tanstack/react-query'
import { NFTService } from '@/services/nft/nft.service'

export function useCollectionByContractAddress(contractAddress: string | null) {
  return useQuery({
    queryKey: ['nft-collection-by-contract', contractAddress],
    queryFn: () => NFTService.getInstance().getCollectionByContractAddress(contractAddress!),
    enabled: !!contractAddress,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}