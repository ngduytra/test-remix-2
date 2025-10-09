import { useMemo } from 'react'
import { useReadContract } from 'thirdweb/react'
import { Address } from 'thirdweb'

import { NFTAbi } from '@/abi'

import { createThirdwebContract } from '@/services/thirdweb/thirdweb.service'

interface IPoolInfo {
  balance: bigint
  totalSupply: bigint
  mintPrice: bigint
  burnRefund: bigint
}

export function useGetCollectionStats(collectionAddress: Address) {
  const { data, ...rest } = useReadContract({
    contract: createThirdwebContract(collectionAddress, NFTAbi),
    method:
      'function getPoolInfo() returns (uint256, uint256, uint256, uint256)',
  })

  const formattedData = useMemo<IPoolInfo | undefined>(() => {
    if (!data) return undefined

    const [balance, totalSupply, mintPrice, burnRefund] = data
    return { balance, totalSupply, mintPrice, burnRefund }
  }, [data])

  return { ...rest, data: formattedData }
}
