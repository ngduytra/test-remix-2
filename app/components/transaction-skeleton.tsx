import Skeleton from './skeleton'

import { cn } from '@/utils'

function TransactionSkeleton() {
  return (
    <div
      className={cn(
        'flex flex-row gap-3 items-center justify-between px-5 py-3 bg-neutral-0 rounded-2xl',
        ' sm:p-3 sm:rounded-xl sm:gap-2 sm:h-16',
      )}
    >
      <div className="flex flex-row gap-5 w-full items-center justify-between">
        <div className="w-[20px] h-[20px] bg-[#D1D5DB] rounded-[4px] animate-pulse" />
        <div className="flex flex-row gap-3 flex-auto items-center justify-between">
          <div className="flex flex-row flex-auto gap-[6px] items-center">
            <div className="flex flex-row gap-3 items-center">
              <div className="w-[31px] h-[10px] bg-[#D1D5DB] rounded-[4px] animate-pulse" />
              <div className="flex flex-row gap-[6px] w-full items-center">
                <div className="flex space-x-1 mr-1 ">
                  <div className="size-8 bg-gradient-to-br sm:size-5 relative bg-neutral-50 pl-1 pt-1 rounded-[8px] animate-pulse">
                    <Skeleton className="rounded-[8px] size-[30px] sm:size-[20px]" />
                  </div>
                </div>
                <div className="w-[31px] h-[10px] bg-[#D1D5DB] rounded-[4px] animate-pulse" />
              </div>
            </div>
            <div className="w-[179px] sm:w-[100px] h-[10px] bg-[#D1D5DB] rounded-[4px] animate-pulse" />
          </div>
          <div className="w-[21px] h-[10px] bg-[#D1D5DB] rounded-[4px] animate-pulse" />
        </div>
        <div className="w-[21px] h-[10px]" />
      </div>
    </div>
  )
}

export default TransactionSkeleton
