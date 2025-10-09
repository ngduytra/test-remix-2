export function undecimalize(
  balance: bigint | string,
  decimals: number,
): string {
  if (typeof balance === 'string') balance = BigInt(balance)

  const divisor = 10n ** BigInt(decimals)
  const integerPart = balance / divisor
  const fractionalPart = balance % divisor

  // Pad fractional part with leading zeros
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0')

  // Trim trailing zeros for neatness
  return `${integerPart}.${fractionalStr}`.replace(/\.?0+$/, '')
}
