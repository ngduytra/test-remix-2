import { IconProps } from '@/types'

export const ResizeIcon = (props: IconProps) => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x={11.3145}
      y={7.07129}
      width={6}
      height={2}
      rx={1}
      transform="rotate(135 11.3145 7.07129)"
      fill="#6F767E"
      fillOpacity={0.4}
    />
    <rect
      x={9.8999}
      y={1.41504}
      width={12}
      height={2}
      rx={1}
      transform="rotate(135 9.8999 1.41504)"
      fill="#6F767E"
      fillOpacity={0.4}
    />
  </svg>
)
