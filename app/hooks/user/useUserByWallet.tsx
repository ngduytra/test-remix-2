import { useQuery } from '@tanstack/react-query'

import { UserService } from '@/services/user.service'

export function useUserByWallet(wallet?: string) {
  return useQuery({
    queryKey: ['user-by-wallet', wallet],
    queryFn: () => UserService.getInstance().getUserByWallet(wallet!),
    enabled: !!wallet,
    staleTime: 1000 * 60 * 5,
  })
}
