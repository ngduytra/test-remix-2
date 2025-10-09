import { useQuery } from '@tanstack/react-query'
import { Address, readContract } from 'thirdweb'

import { CONTRACT_METHODS, NFTService } from '@/services/nft/nft.service'
import {
  GetCollectionsParams,
  GetCollectionsResponse,
} from '@/services/nft/type'
import { createThirdwebContract } from '@/services/thirdweb/thirdweb.service'

import { NFTAbi } from '@/abi/nft.abi'

export function useCollections(
  params?: GetCollectionsParams & { hasSlot?: boolean },
) {
  return useQuery({
    queryKey: ['nft-collections-list', params],
    queryFn: async () => {
      let currentResponse: GetCollectionsResponse = {
        data: [],
        total: 0,
        limit: params?.limit || 10,
        offset: params?.offset || 0,
        hasNext: false,
        hasPrev: false,
      }
      const limit = params?.limit || 10
      let currentOffset = params?.offset || 0
      const filteredCollections = []

      do {
        const collections = await NFTService.getInstance().getCollections({
          ...params,
          offset: currentOffset,
        })
        if (params?.hasSlot) {
          for (const collection of collections.data) {
            const contract = createThirdwebContract(
              collection.contractAddress! as Address,
              NFTAbi,
            )

            const poolInfo = await readContract({
              contract,
              method: CONTRACT_METHODS.GET_POOL_INFO,
              params: [],
            })

            const [, totalSupply] = poolInfo

            if (totalSupply < collection.whitelistConfigs.maxNFTForWhitelist) {
              filteredCollections.push(collection)
            }
            currentOffset++
            if (filteredCollections.length >= limit) {
              break
            }
          }
        } else {
          filteredCollections.push(...collections.data)
        }

        currentResponse = collections
      } while (filteredCollections.length < limit && currentResponse.hasNext)
      return {
        ...currentResponse,
        data: filteredCollections,
        offset: currentOffset,
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}
