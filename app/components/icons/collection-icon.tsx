import { cn } from '@/utils'
import { IconProps } from '@/types'

export const CollectionIcon = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={cn('text-neutral-900', props.className)}
    >
      <rect
        x="3.33331"
        y="7.5"
        width="13.75"
        height="9.16667"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7.5 4.62354H12.9167"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
