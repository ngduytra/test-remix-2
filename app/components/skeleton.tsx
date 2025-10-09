import { cn } from '@/utils'

type SkeletonProps = {
  className?: string
}

const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn(
        'bg-[url("/images/gradient-bg.png")] bg-cover bg-center bg-no-repeat animate-pulse size-full',
        className,
      )}
    />
  )
}

export default Skeleton
