import { ThirdwebService } from '@/services/thirdweb/thirdweb.service'
import { GetNftsTranfersParams } from '@/types'
import { useQuery } from '@tanstack/react-query'

export function useNftTransfers(params: GetNftsTranfersParams) {
  return useQuery({
    queryKey: ['get-nft-transfers', params],
    queryFn: () => ThirdwebService.getInstance().getNftTransfers(params),
    staleTime: 1000 * 60 * 1,
  })
}
