export enum WorkflowStatus {
  Pending = 'status::pending',
  Processing = 'status::processing',
  Completed = 'status::completed',
  Cancelled = 'status::cancelled',
  Failed = 'status::failed',
}

export enum WorkflowType {
  CreatorTestPrompt = 'creator::prompt::test',
  CreatorEnhancePrompt = 'creator::prompt::enhance',
  CreatorPublishPrompt = 'creator::prompt::publish',
  UserBuyAndRunPrompt = 'user::prompt::buy_and_run',
  UserMintNft = 'user::nft::mint',
}

export enum UserDomainAction {}
// TODO: to be clarified in next phase.

export enum FinanceDomainAction {
  CreatePayment = 'finance::create_payment',
  VerifyPayment = 'finance::verify_payment',
}

export enum AiDomainAction {
  RunPrompt = 'ai::run_prompt',
  RunBatchPrompt = 'ai::run_batch_prompt',
  UpdatePromptStatus = 'ai::update_prompt_status',
  EnhancePrompt = 'ai::enhance_prompt',
  GetPromptZeroInstance = 'ai::prompt::get_zero_instance',
  CreatePromptInstances = 'ai::create_prompt_instances',
}

export enum NftDomainAction {
  CreateCollection = 'nft::create_collection',
  VerifyCollectionDeployment = 'nft::verify_collection_deployment',
  UpdateNftMetadata = 'nft::update_nft_metadata',
}

export enum MediaAction {}
// TODO: to be clarified in next phase.

export type DomainAction =
  | UserDomainAction
  | FinanceDomainAction
  | AiDomainAction
  | NftDomainAction
  | MediaAction
