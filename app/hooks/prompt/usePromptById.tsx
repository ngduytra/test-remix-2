import { useQuery } from '@tanstack/react-query'

import { AIService } from '@/services/ai/ai.service'

import { GetPromptResponse } from '@/services/ai/type'

export function usePromptById(id: string) {
  return useQuery<GetPromptResponse>({
    queryKey: ['promptById', id],
    queryFn: () => {
      return AIService.getInstance().getPromptById(id)
    },
    enabled: !!id,
  })
}
