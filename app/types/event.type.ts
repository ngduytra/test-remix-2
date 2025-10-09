import { DomainAction } from './workflow.type'

export enum EventStatus {
  Requested = 'requested',
  Succeeded = 'succeeded',
  Failed = 'failed',
}

export type Event = {
  _id: string
  action: DomainAction
  status: EventStatus
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
  timestamp: Date
}
