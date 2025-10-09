import Button from './button'
import { ArrowDown } from './icons/arrow-down'

import { cn } from '@/utils'

type SeeMoreButtonProps = {
  className?: string
  onClick: () => void
}

const SeeMoreButton = ({ className, onClick }: SeeMoreButtonProps) => {
  return (
    <Button
      variant="primary"
      onClick={onClick}
      className={cn('w-[6.25rem]', className)}
    >
      <ArrowDown />
    </Button>
  )
}

export default SeeMoreButton
