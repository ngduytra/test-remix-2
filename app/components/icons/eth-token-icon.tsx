import { IconProps } from '@/types'

export function EthTokenIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <g clipPath="url(#clip0_872_5779)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 15.5C3.85766 15.5 0.5 12.1423 0.5 8C0.5 3.85766 3.85766 0.5 8 0.5C12.1423 0.5 15.5 3.85766 15.5 8C15.5 12.1423 12.1423 15.5 8 15.5ZM11.7472 8.10266L8.23344 2.375L4.71875 8.10312L8.23344 10.1436L11.7472 8.10266ZM11.75 8.7575L8.23344 10.797L4.71875 8.75797L8.23344 13.6227L11.75 8.7575Z"
          fill="currentColor"
        />
        <path
          d="M8.2334 2.375V6.53281L11.7476 8.10312L8.2334 2.375ZM8.2334 10.7975V13.6227L11.75 8.7575L8.2334 10.7975Z"
          fill="black"
          fillOpacity="0.298"
        />
        <path
          d="M8.2334 10.1435L11.7476 8.10307L8.2334 6.53369V10.1435Z"
          fill="black"
          fillOpacity="0.801"
        />
        <path
          d="M4.71875 8.10307L8.23344 10.1435V6.53369L4.71875 8.10307Z"
          fill="black"
          fillOpacity="0.298"
        />
      </g>
      <defs>
        <clipPath id="clip0_872_5779">
          <rect
            width="15"
            height="15"
            fill="white"
            transform="translate(0.5 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}
