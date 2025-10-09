import { createPublicClient, fallback, http } from 'viem'

export const publicClient = createPublicClient({
  transport: fallback(
    import.meta.env.VITE_BASE_RPCS.split(',').map((rpc: string) => http(rpc)),
  ),
})
