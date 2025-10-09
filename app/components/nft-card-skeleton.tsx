import { cn } from '@/utils'

type NftCardSkeletonProps = {
  className?: string
  displaySell?: boolean
  displayInfo?: boolean
  forceShowSellButton?: boolean
}

const NftCardSkeleton = ({
  className,
  displayInfo = true,
  forceShowSellButton = false,
}: NftCardSkeletonProps) => {
  return (
    <div
      className={cn(
        'border border-light/[0.12] overflow-hidden w-full rounded-xl group',
        className,
      )}
    >
      {/* Image skeleton */}
      <div className="aspect-square">
        <div className="h-full w-full relative overflow-hidden">
          {/* Custom gradient background with blur effect */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('/images/gradient-bg.png')]" />
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-gray-600/20 transform -skew-x-12 animate-shimmer" />
        </div>
      </div>
      {/* Content skeleton */}
      {displayInfo && (
        <div className="flex flex-row justify-between text-neutral-900 py-4 h-[66px] sm:py-3 sm:h-[58px] gap-2">
          <div className="flex flex-col gap-1 w-6/12 ">
            <div className="h-3 w-7/12 bg-gray-100  rounded"></div>
            <div className="h-4 w-full bg-gray-100  rounded"></div>
          </div>
          <div
            className="flex flex-col items-end w-6/12
         gap-1"
          >
            <div className="h-3 w-7/12 bg-gray-100  rounded"></div>
            <div className="h-4 w-full bg-gray-100  rounded"></div>
          </div>
        </div>
      )}
      {forceShowSellButton && <div className="hidden sm:block h-[52px]" />}
    </div>
  )
}

export default NftCardSkeleton
