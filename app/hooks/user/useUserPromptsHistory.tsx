import { useInfiniteQuery } from '@tanstack/react-query'

import { AIService } from '@/services/ai/ai.service'

import { GetPromptsHistoryParams } from '@/services/ai/type'
import { queryClient } from '@/configs'

export function useUserPromptsHistory(
  owner?: string,
  params?: GetPromptsHistoryParams,
) {
  const limit = params?.limit || 20

  return useInfiniteQuery({
    queryKey: ['userPromptsHistory', params, owner],
    queryFn: ({ pageParam = 0 }) =>
      AIService.getInstance().getPromptsHistory({
        ...params,
        offset: pageParam,
        limit,
        isPromptOwner: true,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNext) {
        return lastPage.offset + lastPage.limit
      }
      return undefined
    },
    initialPageParam: 0,
    enabled: !!owner,
  })
}

export function refetchGetUserPromptsHistory() {
  return queryClient.invalidateQueries({
    queryKey: ['userPromptsHistory'],
  })
}
