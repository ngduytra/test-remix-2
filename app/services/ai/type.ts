import { PaginatedResponse, Placeholder, WorkflowType } from '@/types'

import { GPT_IMAGE_SIZE, ImageModel } from '@/constants/collection.constant'

export type PromptMetadata = {
  options: PromptMetadataOptions
}

export type PromptMetadataOptions = {
  size: (typeof GPT_IMAGE_SIZE)[number]
  model: ImageModel
  quality?: 'low' | 'medium' | 'high' | 'auto' | null
  format?: 'png' | 'jpeg' | 'webp' | null
  image?: string[]
}

export type CreatePromptBody = {
  template: string
  isPublished: boolean
  price: number
  owner: string
  metadata: PromptMetadata
}

export type CreatePromptResponse = {
  _id: string
  template: string
  placeholders: Placeholder[]
  isPublished: boolean
  price: number
  owner: string
  metadata: Record<string, any>
}

export type GetPromptsHistoryParams = {
  limit?: number
  offset?: number
  isPromptOwner?: boolean
  source?: WorkflowType
}

export type PromptInstance = {
  _id?: string
  prompt: string
  placeholders: Placeholder[]
  owner: string
  promptId: string
  metadata: {
    imageUrl: string
  }
  updatedAt: string
  createdAt: string
}

export type Prompt = {
  _id?: string
  prompt: string
  template: string
  placeholders: Placeholder[]
  owner: string
  promptId: string
  metadata: {
    options: PromptMetadataOptions
    instance: string[]
  }
  updatedAt: string
  createdAt: string
}

export type PromptInspect = {
  id: string
  template: string
  type: string
  placeholders: Placeholder[]
  isPublished: boolean
  price: number
  owner: string
  metadata: {
    options: PromptMetadataOptions
  }
  createdAt: string
}

export type GetPromptInstanceResponse = PromptInstance
export type GetPromptResponse = Prompt
export type GetPromptInspectResponse = PromptInspect
export type GetPromptsHistoryResponse = PaginatedResponse<PromptInstance[]>
