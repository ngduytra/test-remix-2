import { useMemo } from 'react'
import { Address } from 'thirdweb'
import { useReadContract } from 'thirdweb/react'

import { NFTAbi } from '@/abi'
import { createThirdwebContract } from '@/services/thirdweb/thirdweb.service'

interface IBurnRefundCurrent {
  refund: bigint
  protocolFeeAmount: bigint
  creatorFeeAmount: bigint
}

export function useBurnRefundCurrent(collectionAddress: Address) {
  const { data, ...rest } = useReadContract({
    contract: createThirdwebContract(collectionAddress, NFTAbi),
    method:
      'function getBurnRefundCurrent() returns (uint256, uint256, uint256)',
    queryOptions: {
      enabled: !!collectionAddress,
    },
  })

  const formattedData = useMemo<IBurnRefundCurrent | undefined>(() => {
    if (!data) return undefined

    const [refund, protocolFeeAmount, creatorFeeAmount] = data
    return {
      refund,
      protocolFeeAmount,
      creatorFeeAmount,
    }
  }, [data])

  return {
    ...rest,
    data: formattedData,
  }
}
