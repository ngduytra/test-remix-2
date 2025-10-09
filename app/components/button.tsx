import { LoaderIcon } from 'lucide-react'
import { forwardRef } from 'react'

import { cn } from '@/utils'

type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'neutral' | 'special'
  size?: 'sm' | 'md'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function ButtonComponent(
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      loading,
      disabled,
      ...props
    }: ButtonProps,
    ref,
  ) {
    return (
      <button
        ref={ref}
        {...props}
        disabled={loading || disabled}
        className={cn(
          'px-5 py-3 border shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] rounded-full text-sm font-medium flex items-center justify-center duration-300 gap-1.5',
          variant === 'secondary' &&
            'text-neutral-900 font-medium bg-neutral-0 border-[2px] border-transparent',
          variant === 'secondary' &&
            'hover:backdrop-blur-[50px] hover:border-primary',

          variant === 'primary' &&
            'bg-[#FF8E25]/[0.1] text-primary border-primary border-[2px]',
          variant === 'primary' &&
            'hover:bg-primary hover:backdrop-blur-[50px] hover:text-neutral-0',

          variant === 'neutral' && 'bg-neutral-50 text-neutral-900',
          variant === 'neutral' &&
            'hover:bg-neutral-800 hover:backdrop-blur-[50px] hover:text-neutral-0',

          variant === 'special' && 'special-btn border-neutral-0',

          size === 'md' && 'h-[48px] text-[16px]',
          size === 'sm' && 'h-[40px] text-[14px]',
          disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
          className,
        )}
      >
        {loading ? <LoaderIcon className="animate-spin" /> : children}
      </button>
    )
  },
)

export default Button
