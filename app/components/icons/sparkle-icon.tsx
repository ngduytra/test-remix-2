import { IconProps } from '@/types'

export const SparkleIcon = (props: IconProps) => {
  return (
    <svg
      width={51}
      height={52}
      viewBox="0 0 51 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_d_3361_72513)">
        <path
          d="M25.5 8.45898C25.7636 15.8029 31.6561 21.6954 39 21.959C31.6561 22.2226 25.7636 28.1151 25.5 35.459C25.2364 28.1151 19.3439 22.2226 12 21.959C19.3439 21.6954 25.2364 15.8029 25.5 8.45898Z"
          fill="url(#paint0_linear_3361_72513)"
        />
        <path
          d="M25.5 11.7715C26.8452 16.721 30.7371 20.6134 35.6865 21.959C30.7374 23.3044 26.8455 27.1964 25.5 32.1455C24.1545 27.1961 20.2621 23.3042 15.3125 21.959C20.2624 20.6137 24.1547 16.7213 25.5 11.7715Z"
          stroke="url(#paint1_linear_3361_72513)"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_3361_72513"
          x={0}
          y={0.458984}
          width={51}
          height={51}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={4} />
          <feGaussianBlur stdDeviation={6} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_3361_72513"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_3361_72513"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_3361_72513"
          x1={25.5}
          y1={8.45898}
          x2={25.5}
          y2={35.459}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF8411" />
          <stop offset={1} stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_3361_72513"
          x1={13.7918}
          y1={17.4181}
          x2={25.5}
          y2={35.459}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF7B00" />
          <stop offset={1} stopColor="#FF8E25" />
        </linearGradient>
      </defs>
    </svg>
  )
}
