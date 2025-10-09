import { useQuery } from '@tanstack/react-query'
import { AIService } from '@/services/ai/ai.service'

export function usePromptInspectById(promptId: string | null) {
  return useQuery({
    queryKey: ['prompt-inspect', promptId],
    queryFn: () => AIService.getInstance().getPromptInspect(promptId!),
    enabled: !!promptId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
