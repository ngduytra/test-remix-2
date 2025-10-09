import { IconProps } from '@/types'

export const FillStarIcon = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="45"
      height="45"
      viewBox="0 0 45 38"
      fill="none"
      {...props}
    >
      <g filter="url(#filter0_d_3808_41424)">
        <path
          d="M22.5 8C22.705 13.7119 27.2881 18.295 33 18.5C27.2881 18.705 22.705 23.2881 22.5 29C22.295 23.2881 17.7119 18.705 12 18.5C17.7119 18.295 22.295 13.7119 22.5 8Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_3808_41424"
          x="0"
          y="0"
          width="45"
          height="45"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_3808_41424"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_3808_41424"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}
