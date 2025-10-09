import { useQuery } from '@tanstack/react-query'

import { NFTService } from '@/services/nft/nft.service'

export function useNftMetadataByBaseUri(baseUri: string, tokenId: string) {
  return useQuery({
    queryKey: ['nft-metadata-by-base-uri', baseUri, tokenId],
    queryFn: () =>
      NFTService.getInstance().getNftMetadataByBaseUri(baseUri, tokenId),
    staleTime: 1000 * 60 * 5, // 2 minutes
    enabled: !!baseUri && !!tokenId,
  })
}
