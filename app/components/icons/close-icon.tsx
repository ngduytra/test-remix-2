import { IconProps } from '@/types'

export const CloseIcon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M17.657 6.65674L6.34327 17.9704"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <path
      d="M6.34351 6.65674L17.6572 17.9704"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
)
