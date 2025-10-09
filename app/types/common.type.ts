export type PaginatedResponse<T> = {
  data: T
  total: number
  limit: number
  offset: number
  hasNext: boolean
  hasPrev: boolean
}

export type PaginationDto = {
  offset?: number
  limit?: number
}
