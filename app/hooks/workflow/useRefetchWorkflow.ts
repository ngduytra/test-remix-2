import { useQuery } from '@tanstack/react-query'
import { OrchestratorService } from '@/services/orchestrator/orchestrator.service'
import { DomainAction, EventStatus, WorkflowStatus } from '@/types'

interface UseRefetchWorkflowOptions {
  workflowId: string | null
  expectedEvent: DomainAction
  expectedWorkflowStatus?: WorkflowStatus
  enabled?: boolean
}

/**
 * Generic workflow polling hook that waits for specific domain events
 *
 * @example
 * // Wait for AI prompt completion
 * const { data } = useRefetchWorkflow({
 *   workflowId: 'workflow-123',
 *   expectedEvent: AiDomainAction.RunPrompt,
 *   expectedWorkflowStatus: WorkflowStatus.Completed,
 *   enabled: true
 * })
 *
 * // Wait for NFT metadata update
 * const { data } = useRefetchWorkflow({
 *   workflowId: 'workflow-456',
 *   expectedWorkflowStatus: WorkflowStatus.Completed,
 *   enabled: true
 * })
 *
 * // Wait for payment verification
 * const { data } = useRefetchWorkflow({
 *   workflowId: 'workflow-789',
 *   expectedWorkflowStatus: WorkflowStatus.Completed,
 *   enabled: !!paymentId
 * })
 */
export const useRefetchWorkflow = ({
  workflowId,
  expectedEvent,
  expectedWorkflowStatus,
  enabled = true,
}: UseRefetchWorkflowOptions) => {
  return useQuery({
    queryKey: [
      'workflow-polling',
      workflowId,
      expectedEvent,
      expectedWorkflowStatus,
    ],
    queryFn: async () => {
      if (!workflowId) return null

      const workflow = await OrchestratorService.getInstance().getWorkflowById(
        workflowId,
      )
      if (workflow.status === WorkflowStatus.Failed) {
        throw new Error(`Failed to execute workflow ${workflow._id}`)
      }

      if (
        expectedWorkflowStatus &&
        workflow.status !== expectedWorkflowStatus
      ) {
        return null
      }

      const targetEvent = workflow.events.find(
        (event) =>
          event.action === expectedEvent &&
          event.status === EventStatus.Succeeded,
      )

      if (!targetEvent) {
        return null
      }

      return targetEvent
    },
    enabled: !!workflowId && enabled,
    refetchInterval: (query) => {
      // Stop polling if we have data (success) or if there's an error (failed)
      if (query.state.data || query.state.error) return false
      return 8000 // Poll every 8 seconds
    },
    refetchIntervalInBackground: true,
    retry: false, // Don't retry on error, let the polling handle it
  })
}
