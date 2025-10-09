import { useQuery } from '@tanstack/react-query'
import { ZERO_ADDRESS } from 'thirdweb'

import { BaseScan } from '@/services/base-scan/base-scan.service'

import {
  GetNftInstanceTransfersRequest,
  NextPageParamsGetNftInstanceTransfer,
  NftTransfer,
} from '@/types/blockscout/address-transaction.type'

import { pause } from '@/utils'

export function useGetCreatorNft({
  contractAddress,
  tokenId,
}: Omit<GetNftInstanceTransfersRequest, 'nextPageParams'>) {
  return useQuery({
    queryKey: ['get-creator-nft', contractAddress, tokenId],
    queryFn: async () => {
      if (!contractAddress || !tokenId) return null

      const baseScan = BaseScan.getInstance()
      let nextPageParams: NextPageParamsGetNftInstanceTransfer | null = null
      let lastTransfer: NftTransfer | null = null

      // Fetch transfers until we reach the oldest (nextPageParams === null)
      do {
        const transfersData = await baseScan.getNftInstanceTransfers({
          contractAddress,
          tokenId,
          nextPageParams,
        })

        if (transfersData?.items?.length) {
          lastTransfer = transfersData.items[transfersData.items.length - 1]
        }

        nextPageParams = transfersData?.next_page_params

        if (nextPageParams) {
          await pause(0.1)
        }
      } while (nextPageParams)

      // Check if the last transfer is from Zero address
      if (
        lastTransfer &&
        lastTransfer.from.hash?.toLowerCase() === ZERO_ADDRESS
      ) {
        return lastTransfer.to
      }

      return null
    },
    enabled: !!contractAddress && !!tokenId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
