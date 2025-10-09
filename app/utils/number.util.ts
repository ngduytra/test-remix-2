import { BigNumber } from 'bignumber.js'
import numbro from 'numbro'
import { formatUnits, parseUnits } from 'viem'

export const randomInt = (min = 0, max = 1_000_000_000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Parse number to bigint with decimals. Ex: 1 -> 1_000_000_000_000_000_000
 * @param number - The number to parse
 * @param decimals - The number of decimals to parse
 * @returns The parsed number
 */
export const parseNumber = (number: number | string, decimals = 18) => {
  return parseUnits(number.toString(), decimals)
}

/**
 * Parse number to bigint with decimals. Ex: 1_000_000_000_000_000_000 -> 1
 * @param number - The number to parse
 * @param decimals - The number of decimals to parse
 * @returns The parsed number
 */
export const formatNumber = (
  number: string | number | bigint | undefined,
  decimals = 18,
) => {
  if (number === undefined || number === null) return 0

  if (typeof number === 'string' && number.includes('.')) {
    return Number(number)
  }
  if (typeof number === 'number' && !Number.isInteger(number)) {
    return number
  }

  return Number(formatUnits(BigInt(number), decimals))
}

/** Format number to string with commas. Ex: 1000000 -> 1,000,000
 * @param number - The number to format
 * @returns The formatted number
 */
export const formatNumberString = (
  number: string | bigint | number | undefined,
) => {
  if (!number) return '0'

  return BigNumber(number.toString()).toFormat({
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
  })
}

/**
 * Format token to string with decimals and format it. Ex: 1_000_000_000.000000000000000000 -> 1
 * @param value - The value to format
 * @param decimals - The number of decimals to format
 * @returns The formatted number
 */
export const formatToken = (
  value: bigint | string | undefined,
  decimals = 18,
) => {
  if (!value) return '0'

  const formattedValue = BigNumber(value.toString())
    .div(10 ** decimals)
    .toFixed(6, BigNumber.ROUND_DOWN)

  return BigNumber(formattedValue.toString()).toFormat({
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
  })
}

export const formatCurrency = (value: bigint | number, decimals = 1) => {
  return numbro(value.toString())
    .format({
      average: true,
      mantissa: decimals,
      spaceSeparated: false,
    })
    .replace(/\.0+$/g, '')
}

/**
 * Format percent to string with decimals and format it. Ex: 0.123456789012345678 -> 12.3456789012345678%
 * @param value - The value to format
 * @returns The formatted number
 */
export const formatPercent = (value: number) => {
  return Math.floor(value * 100) / 100
}

/**
 * Calculates the price with slippage tolerance applied.
 * @param basePrice - The base price in wei.
 * @param slippagePercent - The slippage tolerance percentage (e.g., 5 for 5%).
 * @returns The price with slippage applied.
 */
export const calculateSlippagePrice = (
  basePrice: bigint,
  slippagePercent: number,
): bigint => {
  const slippageMultiplier = BigInt(
    Math.floor((1 + slippagePercent / 100) * 1000),
  )
  return (basePrice * slippageMultiplier) / 1000n
}

function getOrdinalSuffix(num: number) {
  if (typeof num !== 'number' || !Number.isInteger(num)) {
    throw new Error('Input must be an integer.')
  }

  const lastDigit = num % 10
  const lastTwoDigits = num % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return 'th' // Handles 11th, 12th, 13th
  }

  switch (lastDigit) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

export function toOrdinal(num: number) {
  return `${num}${getOrdinalSuffix(num)}`
}
