import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  GetNftCollectionsRequest,
  GetNFTInstanceNextPageParams,
  GetNftInstanceResponse,
  GetNftInstancesRequest,
} from '@/types/blockscout/address-transaction.type'
import { BaseScan } from '@/services/base-scan/base-scan.service'

export function useNfts(params: GetNftCollectionsRequest) {
  return useQuery({
    queryKey: ['get-nfts', params.contractAddress, params.ownerAddress],
    queryFn: () => BaseScan.getInstance().getNftCollections(params),
    enabled: !!params.ownerAddress && !!params.contractAddress,
  })
}

export function useInfiniteNfts(params: GetNftInstancesRequest) {
  const queryClient = useQueryClient()
  const refetchRoot = () =>
    queryClient.refetchQueries({
      queryKey: ['get-infinite-nfts', params.contractAddress],
    })

  const infiniteQuery = useInfiniteQuery({
    queryKey: ['get-infinite-nfts', params.contractAddress, params.limit],
    queryFn: ({
      pageParam,
    }: {
      pageParam?: GetNFTInstanceNextPageParams | null
    }) =>
      BaseScan.getInstance().getNftInstancesWithGuaranteedLimit({
        ...params,
        nextPageParam: pageParam,
      }) as Promise<GetNftInstanceResponse>,
    getNextPageParam: (lastPage: {
      next_page_params: GetNFTInstanceNextPageParams | null
      items?: any[]
    }) => {
      if (!lastPage || lastPage.next_page_params === null) return null
      // If we got fewer items than the limit, we've reached the end
      if (lastPage.items && lastPage.items.length < params.limit) return null
      return lastPage.next_page_params
    },
    enabled: !!params.contractAddress,
    initialPageParam: undefined,
  })

  return {
    ...infiniteQuery,
    refetchRoot,
  }
}

export function useRefetchNfts(params: Partial<GetNftCollectionsRequest>) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({
      queryKey: ['get-nfts', params.contractAddress, params.ownerAddress],
    })
  }
}
