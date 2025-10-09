import { useQuery } from '@tanstack/react-query'
import { NFTService } from '@/services/nft/nft.service'

export function useMintCostEstimate(contractAddress: string | null, quantity: number) {
  return useQuery({
    queryKey: ['mint-cost-estimate', contractAddress, quantity],
    queryFn: async () => {
      const nftService = NFTService.getInstance()
      return nftService.estimateMintCost(contractAddress!, quantity)
    },
    enabled: !!contractAddress && quantity > 0,
    staleTime: 1000 * 15, // 15 seconds for pricing
    refetchInterval: 1000 * 15, // Auto-refresh for live pricing
  })
}