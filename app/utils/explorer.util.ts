import { supportChain } from '@/configs'

export const getTxExplorerUrl = (hash: string) => {
  const baseUrl = supportChain.blockExplorers?.[0]?.url
  return baseUrl ? `${baseUrl}/tx/${hash}` : ''
}
