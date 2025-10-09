import { useQuery, useQueryClient } from '@tanstack/react-query'

import { OrchestratorService } from '@/services/orchestrator/orchestrator.service'
import { GetWorkflowsRequest } from '@/services/orchestrator/type'

export function useWorkflows(params: GetWorkflowsRequest) {
  const { data, ...rest } = useQuery({
    queryKey: ['workflow', params],
    queryFn: () => OrchestratorService.getInstance().getWorkflows(params),
  })

  return {
    data: data?.data ?? [],
    total: data?.total ?? 0,
    ...rest,
  }
}

export function useRefetchWorkflows(params: GetWorkflowsRequest) {
  const queryClient = useQueryClient()
  return () =>
    queryClient.invalidateQueries({
      queryKey: ['workflow', params],
    })
}
