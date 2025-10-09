import { useMemo, useRef } from 'react'
import { BigNumber } from 'bignumber.js'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'
import { readContract, isAddress } from 'thirdweb'

import { AscendingTriangleIcon } from '@/components/icons'

import { useMarketCollectionByContractAddress } from '@/hooks/nft/useMarketCollectionByContractAddress'
import { useCollectionPriceBoundedCandles } from '@/hooks/market/useCollectionPriceBoundedCandles'

import { createThirdwebContract } from '@/services/thirdweb/thirdweb.service'
import { NFTAbi } from '@/abi'

import { formatNumber } from '@/utils'
import { Timeframe } from '@/types'
import { GetCollectionResponse } from '@/services/finance/type'

export enum PriceDirection {
  UP = 'up',
  DOWN = 'down',
}

interface UsePriceDirectionProps {
  contractAddress: string
  ethUsdPrice: number
}

interface UsePriceDirectionReturn {
  currentPrice: bigint
  totalSupply: number
  priceDirection: PriceDirection | null
  marketCapInUsd: number
  marketCapIcon: JSX.Element | null
  marketCapColor: string
  collectionInfo?: GetCollectionResponse
}

export function usePriceDirection({
  contractAddress,
  ethUsdPrice,
}: UsePriceDirectionProps): UsePriceDirectionReturn {
  const now = useRef(dayjs())

  const { data: collectionInfo } =
    useMarketCollectionByContractAddress(contractAddress)

  const currentPrice = useMemo(() => {
    return BigInt(collectionInfo?.currentPrice ?? 0)
  }, [collectionInfo?.currentPrice])

  const { data: totalSupply = 0 } = useQuery({
    queryKey: ['totalSupply', contractAddress],
    queryFn: async () => {
      if (!contractAddress || !isAddress(contractAddress)) return 0

      const contract = createThirdwebContract(contractAddress, NFTAbi)
      const totalSupplyData = await readContract({
        contract,
        method: 'function totalSupply() view returns (uint256)',
      })

      return Number(totalSupplyData)
    },
    enabled: !!contractAddress && isAddress(contractAddress),
    staleTime: 1000 * 5, // 5 seconds
  })

  const { data: bounceCandles = { leftBounded: null } } =
    useCollectionPriceBoundedCandles(contractAddress, {
      timeframe: Timeframe.HalfHour,
      from: now.current.subtract(1, 'day').toISOString(),
      to: now.current.subtract(1, 'day').add(1, 'hour').toISOString(),
    })

  const priceDirection = useMemo((): PriceDirection | null => {
    const leftBounded = BigInt(bounceCandles.leftBounded?.close ?? 0)
    if (leftBounded > currentPrice) return PriceDirection.DOWN
    if (leftBounded < currentPrice) return PriceDirection.UP
    return null
  }, [bounceCandles.leftBounded?.close, currentPrice])

  const marketCapInUsd = useMemo(() => {
    if (!currentPrice || !totalSupply || ethUsdPrice === 0) return 0

    return BigNumber(formatNumber(currentPrice))
      .multipliedBy(ethUsdPrice)
      .multipliedBy(totalSupply)
      .toNumber()
  }, [currentPrice, totalSupply, ethUsdPrice])

  const marketCapIcon = useMemo(() => {
    switch (priceDirection) {
      case PriceDirection.DOWN:
        return (
          <AscendingTriangleIcon className="text-red-300 inline-block sm:size-3 rotate-180" />
        )
      case PriceDirection.UP:
        return (
          <AscendingTriangleIcon className="text-neon-700 inline-block sm:size-3" />
        )
      default:
        return null
    }
  }, [priceDirection])

  const marketCapColor = useMemo(() => {
    switch (priceDirection) {
      case PriceDirection.DOWN:
        return 'text-neutral-900'
      case PriceDirection.UP:
        return 'text-neon-700'
      default:
        return ''
    }
  }, [priceDirection])

  return {
    currentPrice,
    totalSupply,
    priceDirection,
    marketCapInUsd,
    marketCapIcon,
    marketCapColor,
    collectionInfo,
  }
}
