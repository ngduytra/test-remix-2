import { useQuery } from '@tanstack/react-query'
import { ZERO_ADDRESS } from 'thirdweb'

import { NFTService } from '@/services/nft/nft.service'

import { MAX_LIMIT } from '@/constants'

export const useGetAllCollectionAddresses = (ownerAddress?: string) => {
  return useQuery({
    queryKey: ['all-collection-addresses', ownerAddress],
    queryFn: async () => {
      const addresses = []

      let k = 0 // use this to avoid infinite loop
      const maxLoop = 1000
      let newOffset = 0
      const limit = MAX_LIMIT
      do {
        const { data: nextData, hasNext } =
          await NFTService.getInstance().getAllCollectionAddresses(
            ownerAddress,
            { offset: newOffset, limit },
          )

        for (const item of nextData) {
          if (item.contractAddress !== ZERO_ADDRESS) {
            addresses.push(item.contractAddress)
          }
        }

        newOffset += limit
        k++
        if (!hasNext) {
          break
        }
      } while (k < maxLoop) // max 50_000 addresses

      return addresses
    },
    staleTime: 60 * 1000, // 1 minute
    refetchOnReconnect: false,
  })
}
