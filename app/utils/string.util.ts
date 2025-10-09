import { isAddress } from 'thirdweb'
import { shortenAddress } from 'thirdweb/utils'

export const bytes20ToAddress = (bytes20: string) => {
  return `0x${bytes20.slice(26)}`
}

export const formatAddress = (address: string, start = 6, end = 4) => {
  if (!address) return ''
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export const formatUsername = (username: string, visibleChars = 5) => {
  if (!username) return ''
  if (username.length <= visibleChars) return username
  return `${username.slice(0, visibleChars)}...`
}

export const formatAddressOrName = (value?: string) => {
  if (!value) return ''
  return isAddress(value) ? shortenAddress(value) : value
}
