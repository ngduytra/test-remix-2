import { cn } from '@/utils'
import { IconProps } from '@/types'

export const CreatorIcon = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={cn('text-[#F8F8F8]', props.className)}
    >
      <rect
        x="3.33331"
        y="11.8779"
        width="13.3333"
        height="5"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <ellipse
        cx="9.99998"
        cy="6.03874"
        rx="2.91667"
        ry="2.91667"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}
