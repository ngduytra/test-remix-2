import { useQuery } from '@tanstack/react-query'
import { BaseScan } from '@/services/base-scan/base-scan.service'
import { GetNftInstanceDetailRequest } from '@/types/blockscout/address-transaction.type'

export function useNftInstanceDetail({
  contractAddress,
  tokenId,
}: GetNftInstanceDetailRequest) {
  return useQuery({
    queryKey: ['nft-instance-detail', contractAddress, tokenId],
    queryFn: () =>
      BaseScan.getInstance().getNftInstanceDetail({ contractAddress, tokenId }),
    enabled: !!contractAddress && !!tokenId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
