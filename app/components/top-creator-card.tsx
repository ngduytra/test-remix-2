import { Link } from '@remix-run/react'
import { BigNumber } from 'bignumber.js'

import Avatar from '@/components/avatar'
import {
  AscendingTriangleIcon,
  CrownIcon,
  Top1Badge,
  Top2Badge,
  Top3Badge,
  VerifiedIcon,
} from '@/components/icons'

import { useUserByWallet } from '@/hooks/user/useUserByWallet'
import { useGetCoinUsdPrice } from '@/hooks/utils'

import {
  cn,
  formatAddressOrName,
  formatCurrency,
  formatNumber,
  formatToken,
} from '@/utils'

import { TokenSymbol } from '@/constants'

import { GetCreatorResponse } from '@/services/finance/type'

type TopCreatorCardProps = {
  rank?: number
  creatorData: GetCreatorResponse
}

const getBadgeIcon = (rank?: number) => {
  switch (rank) {
    case 1:
      return <Top1Badge />
    case 2:
      return <Top2Badge />
    case 3:
      return <Top3Badge />
    default:
      return null
  }
}

function TopCreatorCard({ rank, creatorData }: TopCreatorCardProps) {
  const badgeIcon = getBadgeIcon(rank)
  const { data: creatorDetail } = useUserByWallet(creatorData.address)
  const { data: ethUsdPrice } = useGetCoinUsdPrice(TokenSymbol.ETH)

  return (
    <Link to={`/profile/${creatorData.address}`}>
      <div className="flex flex-col gap-y-5 p-6 bg-neutral-0 rounded-2xl sm:gap-y-3 border-2 border-transparent hover:border-primary">
        <div className="flex flex-col gap-y-3 items-center">
          <div className="relative">
            <Avatar
              src={creatorDetail?.avatar}
              alt="user-avatar"
              className={cn(
                'size-[100px] border-neutral-900 border-[6px] flex-shrink-0',
                'sm:border-[3px]',
                'user-avatar',
              )}
              imageClassName="size-[85px] border-[2px] border-white/[0.53] rounded-full object-cover"
            />

            {rank === 1 && (
              <div className="absolute -top-[26px] left-1/2 -translate-x-1/2">
                <CrownIcon />
              </div>
            )}

            {badgeIcon && (
              <div className="absolute top-0 right-2">{badgeIcon}</div>
            )}
          </div>

          <div className="flex items-center gap-x-[6px]">
            <span className="text-base/none text-neutral-800 font-medium truncate w-full sm:max-w-[100px] sm:text-sm/none">
              {formatAddressOrName(creatorDetail?.username)}
            </span>
            <VerifiedIcon className="sm:size-[18px]" />
          </div>
        </div>

        <div className="flex flex-col gap-y-3 items-center">
          <span className="text-base/none text-neutral-600 sm:text-sm/none">
            Total Earnings
          </span>
          <div className="flex items-center gap-x-1">
            <AscendingTriangleIcon className="text-neon-700 size-7" />
            <div className="flex items-center gap-x-[10px]">
              <span className="text-[28px] text-neutral-900 font-bold sm:text-lg/none">
                {formatToken(creatorData.totalEarning)} ETH
              </span>
              <span className="text-lg/none text-neutral-600 sm:text-sm/none">
                $
                {formatCurrency(
                  BigNumber(ethUsdPrice)
                    .multipliedBy(formatNumber(creatorData.totalEarning))
                    .toNumber(),
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default TopCreatorCard
