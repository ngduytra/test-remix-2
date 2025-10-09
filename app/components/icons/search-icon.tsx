import { cn } from '@/utils'
import { IconProps } from '@/types'

export const SearchIcon = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={cn('text-[#DEDEDE]', props.className)}
    >
      <path
        d="M11.4375 11.4375L14.25 14.25M13 7.375C13 5.88316 12.4074 4.45242 11.3525 3.39752C10.2976 2.34263 8.86684 1.75 7.375 1.75C5.88316 1.75 4.45242 2.34263 3.39752 3.39752C2.34263 4.45242 1.75 5.88316 1.75 7.375C1.75 8.86684 2.34263 10.2976 3.39752 11.3525C4.45242 12.4074 5.88316 13 7.375 13C8.86684 13 10.2976 12.4074 11.3525 11.3525C12.4074 10.2976 13 8.86684 13 7.375Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
