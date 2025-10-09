import { useQuery } from '@tanstack/react-query'

import { useGetAllCollectionAddresses } from '@/hooks/nft/useGetAllCollectionAddresses'

import { BaseScan } from '@/services/base-scan/base-scan.service'

import { pause } from '@/utils'

import { FilteredNft } from './useInfiniteNftsByOwner'
import { GetNftInstancesNextPageParams } from '@/types/blockscout/address-transaction.type'

export const usePrefetchAllNftsByOwner = (owner: string) => {
  const { data: collectionAddresses = [] } = useGetAllCollectionAddresses()

  const {
    data: allFilteredNfts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['all-nfts-by-owner', owner, collectionAddresses],
    queryFn: async () => {
      const baseScan = BaseScan.getInstance()
      let nextPageParams: GetNftInstancesNextPageParams = null
      const allNfts: FilteredNft[] = []

      do {
        const result = await baseScan.getNftsByOwner(owner, nextPageParams)

        if (result.items && result.items.length > 0) {
          const filteredItems = result.items
            .filter((nft) => {
              if (!nft?.token?.address_hash || !nft.id) return false
              const contractAddress = nft.token.address_hash.toLowerCase()
              return collectionAddresses.some(
                (addr) => addr.toLowerCase() === contractAddress,
              )
            })
            .map((nft) => ({
              id: nft.id,
              tokenId: nft.id,
              contractAddress: nft.token.address_hash,
              image: nft.image_url || nft.media_url || '',
              collectionName: nft.token?.name,
              owner: owner,
              metadata: nft.metadata,
            }))
          allNfts.push(...filteredItems)
        }

        nextPageParams = result.nextPageParams

        await pause(0.1)
      } while (nextPageParams)

      return allNfts
    },
    enabled: !!owner && collectionAddresses.length > 0,
    staleTime: 60 * 1000,
    refetchOnReconnect: false,
  })

  return {
    allDopamintNfts: allFilteredNfts,
    isLoading,
    isError,
    totalCount: allFilteredNfts.length,
  }
}
