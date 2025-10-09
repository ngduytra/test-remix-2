import Button from '@/components/button'

import { cn } from '@/utils'

type SocialButtonProps = {
  icon: React.ReactNode
  onClick: () => void
  className?: string
}

const SocialButton = ({ icon, onClick, className }: SocialButtonProps) => {
  return (
    <Button
      variant="secondary"
      className={cn('size-12 p-0', className)}
      onClick={onClick}
    >
      {icon}
    </Button>
  )
}

export default SocialButton
