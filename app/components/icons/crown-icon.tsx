import { IconProps } from '@/types'

export const CrownIcon = (props: IconProps) => (
  <svg
    width={44}
    height={45}
    viewBox="0 0 44 45"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_5317_28175)">
      <path
        d="M22 11.75L29.3333 22.75L38.5 15.4167L34.8333 33.75H9.16667L5.5 15.4167L14.6667 22.75L22 11.75Z"
        fill="url(#paint0_linear_5317_28175)"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_5317_28175"
        x1={22}
        y1={11.75}
        x2={22}
        y2={33.75}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFCC00" />
        <stop offset={1} stopColor="#F9E48E" />
      </linearGradient>
      <clipPath id="clip0_5317_28175">
        <rect
          width={44}
          height={44}
          fill="white"
          transform="translate(0 0.75)"
        />
      </clipPath>
    </defs>
  </svg>
)
