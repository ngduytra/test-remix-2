import { cn } from '@/utils'

type Props = {
  children: React.ReactNode
  isHorizontal?: boolean
  isActive?: boolean
  containerClassName?: string
  className?: string
}
const GradientBorderContainer = ({
  children,
  className,
  containerClassName,
  isHorizontal,
  isActive,
}: Props) => {
  return (
    <div
      className={cn(
        'p-[2.5px] cursor-pointer relative overflow-hidden',
        'gradient-border',
        isHorizontal
          ? 'gradient-border-horizontal'
          : 'gradient-border-vertical',
        isActive && 'gradient-border-active',
        containerClassName,
      )}
    >
      <div className={cn('relative', className)}>{children}</div>
    </div>
  )
}

export default GradientBorderContainer
