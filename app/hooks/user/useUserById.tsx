import { useQuery } from '@tanstack/react-query'
import { UserService } from '@/services/user.service'

export function useUserById(id: string | null) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => UserService.getInstance().getUserById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}
