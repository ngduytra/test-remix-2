import { useQuery } from '@tanstack/react-query'
import { OrchestratorService } from '@/services/orchestrator/orchestrator.service'
import { FinanceDomainAction, EventStatus, WorkflowStatus } from '@/types'

export const useRefetchPayment = (workflowId: string | null) => {
  return useQuery({
    queryKey: ['payment-polling', workflowId],
    queryFn: async () => {
      if (!workflowId) return null

      const workflow = await OrchestratorService.getInstance().getWorkflowById(
        workflowId,
      )
      if (workflow.status === WorkflowStatus.Failed) {
        throw new Error(`Failed to execute workflow ${workflow._id}`)
      }

      const targetEvent = workflow.events[workflow.events.length - 1]

      if (
        !targetEvent ||
        targetEvent.action !== FinanceDomainAction.CreatePayment
      ) {
        // CreatePayment Event not found yet, continue polling
        return null
      }

      if (targetEvent.status === EventStatus.Failed) {
        throw new Error('Failed to create payment')
      }

      if (targetEvent.status === EventStatus.Succeeded) {
        // Success! Return the payload and stop polling
        return targetEvent.payload as { genId: string; paymentId: string }
      }

      // Event exists but not succeeded yet, continue polling
      return null
    },
    enabled: !!workflowId,
    refetchInterval: (query) => {
      // Stop polling if we have data (success) or if there's an error (failed)
      if (query.state.data || query.state.error) return false
      return 1000 // Poll every 1 second
    },
    retry: false, // Don't retry on error, let the polling handle it
  })
}
