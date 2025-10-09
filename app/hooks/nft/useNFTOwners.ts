import { useQuery } from '@tanstack/react-query'

import { ThirdwebService } from '@/services/thirdweb/thirdweb.service'
import { supportChain } from '@/configs'

export const useNFTOwners = (contractAddress: string) => {
  return useQuery({
    queryKey: ['contractNFTs', contractAddress],
    queryFn: () =>
      ThirdwebService.getInstance().getNFTOwners(
        contractAddress,
        supportChain.id,
      ),
    enabled: !!contractAddress,
  })
}
