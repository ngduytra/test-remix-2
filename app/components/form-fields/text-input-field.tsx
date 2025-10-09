import { forwardRef } from 'react'

type TextInputFieldProps = {
  id: string
  label: string
  placeholder?: string
  className?: string
  required?: boolean
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export const TextInputField = forwardRef<HTMLInputElement, TextInputFieldProps>(
  (
    {
      id,
      label,
      placeholder = '',
      className,
      required = false,
      error,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={`flex flex-col gap-2 ${className || ''}`}>
        <label className="text-[14px] font-normal text-neutral-900">
          {label}
          {required && <span className="text-red-500 text-sm"> *</span>}
        </label>
        <div className="flex gap-3 h-12 items-center px-5 py-3 rounded-[48px] border-[1.5px] border-neutral-100 focus:border-primary hover:border-primary">
          <input
            ref={ref}
            id={id}
            className="flex-1 bg-transparent outline-none text-[14px] text-neutral-900 placeholder:text-neutral-900/50 caret-primary-500"
            placeholder={placeholder}
            {...props}
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    )
  },
)

TextInputField.displayName = 'TextInputField'
