import { Progress as ProgressComponent } from 'radix-ui'

import { cn } from '@/utils'

type FixedProgressProps = {
  progress: number
  label: React.ReactNode | string
  rootClassName?: string
  indicatorClassName?: string
  labelClassName?: string
}

const FixedProgress = ({
  progress,
  label,
  rootClassName,
  indicatorClassName,
  labelClassName,
}: FixedProgressProps) => {
  return (
    <div className="relative w-full">
      <ProgressComponent.Root
        className={cn(
          'w-full h-2 bg-dark/[0.12] rounded-full relative',
          rootClassName,
        )}
        value={progress}
      >
        <ProgressComponent.Indicator
          className={cn('h-full bg-primary rounded-full', indicatorClassName)}
          style={{ width: `${progress}%` }}
        />
      </ProgressComponent.Root>
      <div
        className={cn(
          'absolute right-0 -top-8 hidden',
          label && 'block',
          labelClassName,
        )}
      >
        <span>{label}</span>
      </div>
    </div>
  )
}

export default FixedProgress
