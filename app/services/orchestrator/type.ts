import {
  DomainAction,
  Event,
  PaginatedResponse,
  Placeholder,
  PromptType,
  WorkflowStatus,
  WorkflowType,
} from '@/types'

export type CreatePromptWorkflowBody = {
  promptId: string
  type: PromptType
  placeholders: Placeholder[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: Record<string, any>
}

export type CreatePromptWorkflowResponse = {
  workflowId: string
}

export type GetWorkflowByIdResponse = {
  _id: string
  uid: string
  type: WorkflowType
  status: WorkflowStatus
  correlationId?: string
  steps: DomainAction[]
  events: Event[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputs: Record<string, any>
}

export type PublishCollectionWorkflowBody = {
  promptId: string
  name: string
  description: string
  socials?: {
    x?: string
    telegram?: string
    farcaster?: string
    website?: string
  }
}

export type PublishCollectionWorkflowResponse = {
  workflowId: string
}

export interface MetadataOptions {
  size?: string // e.g. 1024x1024, 1536x1024 (landscape), 1024x1536 (portrait), or auto for `gpt-image-1`
  model?: string // NOTE: support `fal-ai/nano-banana`, `gpt-image-1`, `black-forest-labs/flux-kontext-pro` for now
  quality?: 'low' | 'medium' | 'high' | 'auto' | null
  format?: 'png' | 'jpeg' | 'webp' | null
  image?: string[] // Image URLs for the variation
  [key: string]: any
}

export type ExecutePromptVariationDto = {
  placeholders: Placeholder[]
  options: MetadataOptions
}

export type UserPromptMintWorkflowBody = {
  promptId: string
  variations: ExecutePromptVariationDto[]
}

export type UserPromptMintWorkflowResponse = {
  workflowId: string
}

export type GetWorkflowsRequest = {
  correlationId?: string
  status?: WorkflowStatus
  type?: WorkflowType
}

export type GetWorkflowsResponse = PaginatedResponse<GetWorkflowByIdResponse[]>
export type RunBatchPromptDto = {
  tokens: Array<{ tokenId: number; genId: string }>
}

export type CreatedPromptInstance = {
  id: string
  genId: string
  variantNo: number
}

export type CreatePromptInstancesSucceededPayload = {
  promptId: string
  instances: CreatedPromptInstance[]
}

export type StartRetryMintWorkflowBody = {
  variations: ExecutePromptVariationDto[]
  tokens: { tokenId: number; genId: string }[]
}

export type StartRetryMintWorkflowResponse = {
  workflowId: string
}
