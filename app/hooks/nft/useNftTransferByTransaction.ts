import { useQuery } from '@tanstack/react-query'

import { BaseScan } from '@/services/base-scan/base-scan.service'

import { TokenType } from '@/types/blockscout/base-types/token'

export const useNftTransferByTransaction = (
  txHash: string,
  type: TokenType,
) => {
  return useQuery({
    queryKey: ['contractNFTs', txHash, type],
    queryFn: () =>
      BaseScan.getInstance().getTokenTransferByTxHash(txHash, type),
    enabled: !!txHash,
  })
}
