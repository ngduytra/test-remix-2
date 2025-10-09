import { useQuery } from '@tanstack/react-query'
import { ownerOf } from 'thirdweb/extensions/erc721'
import { Address } from 'thirdweb'

import { createThirdwebContract } from '@/services/thirdweb/thirdweb.service'

import { NFTAbi } from '@/abi'

export const useNft721Owner = (
  contractAddress: string | Address,
  tokenId: string | bigint,
) => {
  return useQuery({
    queryKey: ['nft721Owner', contractAddress, tokenId],
    queryFn: () =>
      ownerOf({
        contract: createThirdwebContract(contractAddress as Address, NFTAbi),
        tokenId: BigInt(tokenId),
      }),
    enabled: !!contractAddress && !!tokenId,
  })
}
