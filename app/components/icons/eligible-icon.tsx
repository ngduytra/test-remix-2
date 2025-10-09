import { IconProps } from '@/types'

export const EligibleIcon = (props: IconProps) => {
  const filterId = `filter0_i_eligible_${Math.random()}`
  const gradientId = `paint0_radial_eligible_${Math.random()}`

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter={`url(#${filterId})`}>
        <circle cx="12" cy="12" r="12" fill={`url(#${gradientId})`} />
      </g>
      <path
        d="M9.80078 11.2834L11.938 13.6474C11.9847 13.6982 12.042 13.7382 12.1059 13.7645C12.1697 13.7908 12.2385 13.8028 12.3075 13.7996C12.3764 13.7965 12.4439 13.7783 12.5051 13.7463C12.5662 13.7143 12.6197 13.6693 12.6616 13.6144L17.0008 7.7998"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.9992 13.1998C16.9992 14.2678 16.6825 15.3119 16.0892 16.1999C15.4958 17.0879 14.6524 17.78 13.6657 18.1888C12.679 18.5975 11.5932 18.7044 10.5457 18.496C9.49824 18.2877 8.53605 17.7734 7.78084 17.0182C7.02564 16.263 6.51134 15.3008 6.30298 14.2533C6.09462 13.2058 6.20156 12.12 6.61027 11.1333C7.01898 10.1466 7.71112 9.30323 8.59914 8.70987C9.48717 8.11651 10.5312 7.7998 11.5992 7.7998"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <filter
          id={filterId}
          x="0"
          y="0"
          width="24"
          height="28"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="32" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 0.939316 0 0 0 0 0.85166 0 0 0 1 0"
          />
          <feBlend
            mode="overlay"
            in2="shape"
            result="effect1_innerShadow_3700_12513"
          />
        </filter>
        <radialGradient
          id={gradientId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(5.52681 22.2587) rotate(-47.765) scale(25.155 33.1925)"
        >
          <stop stopColor="#340C00" />
          <stop offset="0.229167" stopColor="#541400" />
          <stop offset="0.40625" stopColor="#831F00" />
          <stop offset="0.536458" stopColor="#AB2706" />
          <stop offset="0.610305" stopColor="#C82D0B" />
          <stop offset="0.696648" stopColor="#E5320F" />
          <stop offset="0.762074" stopColor="#E74F13" />
          <stop offset="0.820443" stopColor="#E97318" />
          <stop offset="0.897181" stopColor="#EA9924" />
          <stop offset="0.970352" stopColor="#FFCD84" />
        </radialGradient>
      </defs>
    </svg>
  )
}
