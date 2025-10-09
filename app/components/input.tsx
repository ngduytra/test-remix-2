import { forwardRef, InputHTMLAttributes } from 'react'

import { cn } from '@/utils'

type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(function InputComponent(
  { className, ...rest },
  ref,
) {
  return (
    <input
      {...rest}
      ref={ref}
      className={cn(
        'bg-transparent border text-neutral-900 placeholder:text-neutral-900/[0.5] px-5 py-3 rounded-full outline-none text-sm h-12 placeholder:text-sm',
        'border-dark/[0.12] focus:border-primary hover:border-primary caret-primary-500',
        'disabled:bg-light/10 disabled:pointer-events-none',
        className,
      )}
    />
  )
})

export default Input
