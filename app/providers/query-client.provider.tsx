import { QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/configs/query-client.config'

export function QueryClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  )
}
