import { IconProps } from '@/types'

export const StarEditIcon = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        d="M11.875 5L15 8.125M3.125 13.75L15 1.875L18.125 5L6.25 16.875H3.125V13.75Z"
        stroke="currentColor"
      />
      <path
        d="M5 1.25L6.06125 3.93875L8.75 5L6.06125 6.06125L5 8.75L3.93875 6.06125L1.25 5L3.93875 3.93875L5 1.25ZM16.25 10L16.9575 11.7925L18.75 12.5L16.9575 13.2075L16.25 15L15.5425 13.2075L13.75 12.5L15.5425 11.7925L16.25 10ZM12.5 14.375L13.03 15.72L14.375 16.25L13.03 16.78L12.5 18.125L11.97 16.78L10.625 16.25L11.97 15.72L12.5 14.375Z"
        fill="currentColor"
      />
    </svg>
  )
}
