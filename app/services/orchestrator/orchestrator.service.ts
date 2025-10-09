import { BaseService } from '../base-service'
import {
  CreatePromptWorkflowBody,
  CreatePromptWorkflowResponse,
  GetWorkflowByIdResponse,
  GetWorkflowsRequest,
  GetWorkflowsResponse,
  PublishCollectionWorkflowBody,
  PublishCollectionWorkflowResponse,
  UserPromptMintWorkflowBody,
  UserPromptMintWorkflowResponse,
  RunBatchPromptDto,
  StartRetryMintWorkflowBody,
} from './type'

export class OrchestratorService extends BaseService {
  static instance: OrchestratorService
  constructor() {
    super(import.meta.env.VITE_DOPAMINT_ORCHESTRATOR_API)
  }

  async createPromptWorkflow(payload: CreatePromptWorkflowBody) {
    const { data } = await this.axios.post<CreatePromptWorkflowResponse>(
      '/creator-prompt-test/start',
      payload,
    )
    return data
  }

  async continueCreatePromptWorkflow(workflowId: string) {
    const { data } = await this.axios.post<CreatePromptWorkflowResponse>(
      `/creator-prompt-test/${workflowId}/continue-payment`,
    )
    return data
  }

  async publishCollectionWorkflow(payload: PublishCollectionWorkflowBody) {
    const { data } = await this.axios.post<PublishCollectionWorkflowResponse>(
      '/publish-prompt/start',
      payload,
    )
    return data
  }

  async continuePublishCollectionWorkflow(workflowId: string) {
    const { data } = await this.axios.post<PublishCollectionWorkflowResponse>(
      `/publish-prompt/${workflowId}/verify-deployment`,
    )
    return data
  }

  async continueUserPromptMintWorkflow(workflowId: string) {
    const { data } = await this.axios.post<UserPromptMintWorkflowResponse>(
      `/user-prompt-mint/${workflowId}/continue-payment`,
    )
    return data
  }

  async getWorkflowById(workflowId: string) {
    const { data } = await this.axios.get<GetWorkflowByIdResponse>(
      `/workflow/${workflowId}`,
    )
    return data
  }
  async getWorkflows(params: GetWorkflowsRequest) {
    const { data } = await this.axios.get<GetWorkflowsResponse>(`/workflow`, {
      params,
    })
    return data
  }

  // New batch prompt mint workflow methods
  async createUserPromptMintWorkflow(payload: UserPromptMintWorkflowBody) {
    const { data } = await this.axios.post<{ workflowId: string }>(
      '/user-prompt-mint/start',
      payload,
    )
    return data
  }

  async runBatchPrompt(workflowId: string, payload: RunBatchPromptDto) {
    const { data } = await this.axios.post(
      `/user-prompt-mint/${workflowId}/run-batch`,
      payload,
    )
    return data
  }

  async startRetryMintWorkflow(body: StartRetryMintWorkflowBody) {
    const { data } = await this.axios.post(`/retry-prompt-mint/start`, body)
    return data
  }

  static getInstance() {
    if (!OrchestratorService.instance) {
      OrchestratorService.instance = new OrchestratorService()
    }
    return OrchestratorService.instance
  }
}
