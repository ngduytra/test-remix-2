import { IconProps } from '@/types'

export const Top1Badge = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={24}
    viewBox="0 0 16 24"
    fill="none"
    {...props}
  >
    <path
      d="M14.2051 1.75L13.9824 2.93457L10.4111 21.9346L10.2578 22.75H1.79492L2.0166 21.5664L4.44824 8.5791H2.91406L3.13965 7.39258L4.05859 2.56348L4.21289 1.75H14.2051Z"
      fill="white"
      stroke="url(#paint0_linear_5317_28178)"
      strokeWidth={2}
    />
    <defs>
      <linearGradient
        id="paint0_linear_5317_28178"
        x1={8}
        y1={2.75}
        x2={8}
        y2={21.75}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF8E25" />
        <stop offset={0.504808} stopColor="#FEBF84" />
        <stop offset={1} stopColor="white" />
      </linearGradient>
    </defs>
  </svg>
)
