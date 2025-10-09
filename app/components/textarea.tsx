import { forwardRef, InputHTMLAttributes } from 'react'

import { cn } from '@/utils'

type TextareaProps = InputHTMLAttributes<HTMLTextAreaElement>

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function TextareaComponent({ className, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        {...rest}
        className={cn(
          'bg-transparent border text-neutral-900 placeholder:text-[#7B7B7B] px-5 py-3 rounded-2xl text-sm h-40 placeholder:text-sm',
          'border-dark/[0.12] focus:border-primary hover:border-primary focus:outline-none caret-primary-500',
          className,
        )}
      />
    )
  },
)

export default Textarea
