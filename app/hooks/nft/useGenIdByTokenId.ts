import { readContract } from 'thirdweb/transaction'
import { useQuery } from '@tanstack/react-query'

import { createThirdwebContract } from '@/services/thirdweb/thirdweb.service'

import { NFTAbi } from '@/abi'

export const useGenIdByTokenId = (contractAddress: string, tokenId: string) => {
  return useQuery({
    queryKey: ['gen-id-by-token-id', tokenId],
    queryFn: async () => {
      const nftContract = createThirdwebContract(contractAddress, NFTAbi)
      const genId = await readContract({
        contract: nftContract,
        method: 'function tokenIdToGenId(uint256) view returns (uint256)',
        params: [BigInt(tokenId)],
      })
      return genId
    },
    enabled: !!contractAddress && !!tokenId,
  })
}
