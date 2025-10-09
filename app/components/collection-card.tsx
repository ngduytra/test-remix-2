import { BigNumber } from 'bignumber.js'

import { AscendingTriangleIcon, DotIcon } from '@/components/icons'
import ImageLayout from './image-layout'

import { useGetCoinUsdPrice } from '@/hooks/utils'

import { TokenSymbol } from '@/constants'
import { CollectionWithMarketData } from '@/services/nft/type'
import { formatCurrency, formatNumber, formatToken } from '@/utils'

type CollectionCardProps = {
  data: CollectionWithMarketData
}

const CollectionCard = ({ data }: CollectionCardProps) => {
  const { data: ethPrice } = useGetCoinUsdPrice(TokenSymbol.ETH)

  return (
    <div className="space-y-3 cursor-pointer bg-neutral-0 p-2 rounded-[20px]">
      <ImageLayout images={data.images} />
      <div className="space-y-2 p-3 pt-0 pb-4">
        <div className="!mt-3">
          <span className="text-neutral-900  text-base line-clamp-2">
            {data.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-[2px]">
            <span className="text-lg font-bold text-neutral-900">
              {formatToken(data.price)} ETH
            </span>
            <span className="text-xs text-neutral-600">
              $
              {formatCurrency(
                BigNumber(ethPrice)
                  .multipliedBy(formatNumber(data.price))
                  .toNumber(),
              )}
            </span>
          </div>
          {data.change !== 0 &&
            (data.change > 0 ? (
              <div className="flex gap-x-[2px] items-center">
                <AscendingTriangleIcon className="text-neon-700 inline-block sm:size-3" />
              </div>
            ) : (
              <div className="flex gap-x-[2px] items-center">
                <AscendingTriangleIcon className="text-red-300 inline-block sm:size-3 rotate-180" />
              </div>
            ))}
        </div>
        <div className="flex justify-between w-full">
          <div className="flex gap-x-[6px] items-center">
            <span className="text-sm font-medium text-neutral-900">
              {data.supply}{' '}
              <span className="text-neutral-600">
                NFT
                {data.supply > 1 ? 's' : null}
              </span>
            </span>
            <DotIcon className="text-neutral-600" />
            <span className="text-sm font-medium text-neutral-900">
              {data.holderCounter}{' '}
              <span className="text-neutral-600">
                Holder{data.holderCounter > 1 ? 's' : null}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionCard
