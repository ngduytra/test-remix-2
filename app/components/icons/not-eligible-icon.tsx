import { IconProps } from '@/types'

export const NotEligibleIcon = (props: IconProps) => {
  const filterId = `filter0_i_not_eligible_${Math.random()}`
  const gradientId = `paint0_radial_not_eligible_${Math.random()}`

  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g opacity="1">
        <g filter={`url(#${filterId})`}>
          <circle
            cx="12.5"
            cy="12"
            r="12"
            fill={`url(#${gradientId})`}
          />
        </g>
        <path
          d="M10.3008 11.2834L12.438 13.6474C12.4847 13.6982 12.542 13.7382 12.6059 13.7645C12.6697 13.7908 12.7385 13.8028 12.8075 13.7996C12.8764 13.7965 12.9439 13.7783 13.0051 13.7463C13.0662 13.7143 13.1197 13.6693 13.1616 13.6144L17.5008 7.7998"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.4992 13.1998C17.4992 14.2678 17.1825 15.3119 16.5892 16.1999C15.9958 17.0879 15.1524 17.78 14.1657 18.1888C13.179 18.5975 12.0932 18.7044 11.0457 18.496C9.99824 18.2877 9.03605 17.7734 8.28084 17.0182C7.52564 16.263 7.01134 15.3008 6.80298 14.2533C6.59462 13.2058 6.70156 12.12 7.11027 11.1333C7.51898 10.1466 8.21112 9.30323 9.09914 8.70987C9.98717 8.11651 11.0312 7.7998 12.0992 7.7998"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter
          id={filterId}
          x="0.5"
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
            result="effect1_innerShadow_3083_44445"
          />
        </filter>
        <radialGradient
          id={gradientId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(6.02681 22.2587) rotate(-47.765) scale(25.155 33.1925)"
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
