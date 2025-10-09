import { useQuery } from '@tanstack/react-query'

import { NFTService } from '@/services/nft/nft.service'

export function useNftMetadata(contractAddress: string, tokenId: string) {
  return useQuery({
    queryKey: ['nft-metadata', contractAddress, tokenId],
    queryFn: async () => {
      try {
        const collection =
          await NFTService.getInstance().getCollectionByContractAddress(
            contractAddress!,
          )
        return await NFTService.getInstance().getNftMetadataByBaseUri(
          collection.baseURI!,
          tokenId,
        )
      } catch {
        //we also want to catch null value
        return null
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!contractAddress && !!tokenId,
  })
}
