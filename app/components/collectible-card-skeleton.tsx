import { cn } from '@/utils'

type CollectibleCardSkeletonProps = {
  className?: string
}

const CollectibleCardSkeleton = ({
  className,
}: CollectibleCardSkeletonProps) => {
  return (
    <div
      className={cn(
        'group rounded-[12px] p-[2px] cursor-pointer bg-transparent animate-pulse',
        className,
      )}
    >
      <div className="flex flex-col gap-3 items-center pb-3 pt-0 px-0 w-full bg-white rounded-[10px] overflow-hidden">
        {/* Image skeleton */}
        <div className="relative aspect-square w-full">
          <div className="absolute inset-0 bg-[url(/gradient-bg.png)] " />
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-gray-600/20 transform -skew-x-12 animate-shimmer" />
        </div>

        {/* Content skeleton */}
        <div className="flex items-center justify-between px-3 py-0 w-full">
          <div className="flex flex-col gap-[3px] items-start">
            <div className="h-3 w-8 bg-gray-200 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
          </div>

          <div className="flex flex-col gap-[3px] items-end">
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectibleCardSkeleton
