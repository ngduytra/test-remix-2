import { useReadContract } from 'thirdweb/react'
import { Address } from 'thirdweb'

import { NFTAbi } from '@/abi'
import { createThirdwebContract } from '@/services/thirdweb/thirdweb.service'

export const useCreatorTotalReward = (collectionAddress: Address) => {
  const { data, ...rest } = useReadContract({
    contract: createThirdwebContract(collectionAddress, NFTAbi),
    method: 'creatorTotalReward',
  })

  return {
    ...rest,
    data: data ? (data as bigint) : 0n,
  }
}
