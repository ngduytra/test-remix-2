import { BaseService } from '../base-service'

import {
  CreatePromptBody,
  CreatePromptResponse,
  GetPromptsHistoryResponse,
  GetPromptInstanceResponse,
  GetPromptResponse,
  GetPromptsHistoryParams,
  GetPromptInspectResponse,
} from './type'

export class AIService extends BaseService {
  static instance: AIService
  constructor() {
    super(import.meta.env.VITE_DOPAMINT_AI_API)
  }

  async createPrompt(body: CreatePromptBody) {
    const { data } = await this.axios.post<CreatePromptResponse>('/prompts', {
      ...body,
      price: body.price.toString(),
    })
    return data
  }

  async getPromptInstanceById(id: string) {
    const { data } = await this.axios.get<GetPromptInstanceResponse>(
      `/prompts/instances/${id}`,
    )
    return data
  }

  async getPromptsHistory(params: GetPromptsHistoryParams) {
    const { data } = await this.axios.get<GetPromptsHistoryResponse>(
      '/prompts/instances/mine',
      {
        params,
      },
    )
    return data
  }

  async getPromptById(id: string) {
    const { data } = await this.axios.get<GetPromptResponse>(`/prompts/${id}`)
    return data
  }

  async getPromptInspect(id: string) {
    const { data } = await this.axios.get<GetPromptInspectResponse>(
      `/prompts/${id}/inspect`,
    )
    return data
  }

  static getInstance() {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }
}
