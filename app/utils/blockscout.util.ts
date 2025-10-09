// Generic types for paginated data fetching
interface PaginatedRequest {
  nextPageParam?: Record<string, any> | null
  limit?: number
}

interface PaginatedResponse<T> {
  items: T[]
  next_page_params?: Record<string, any> | null
}

// Generic utility function for fetching paginated data until limit is reached
export async function fetchUntilLimit<
  TItem,
  TRequest extends PaginatedRequest & Record<string, any>,
>(
  fetchFunction: (params: TRequest) => Promise<PaginatedResponse<TItem>>,
  filterFunction: (item: TItem) => boolean,
  baseRequest: TRequest,
  extractNextPageParam?: (item: TItem) => Record<string, any> | null,
): Promise<{
  items: TItem[]
  next_page_params: Record<string, any> | null | undefined
}> {
  const { limit = 20, nextPageParam: initialNextPageParam } = baseRequest

  let allFilteredItems: TItem[] = []
  let nextPageParam: Record<string, any> | null | undefined =
    initialNextPageParam

  while (allFilteredItems.length < limit) {
    try {
      // Prepare request with pagination

      if (nextPageParam) {
        baseRequest = { ...baseRequest, ...nextPageParam } as TRequest
      }

      // Fetch next page
      const result = await fetchFunction(baseRequest)

      // Filter items using provided filter function
      const filteredItems = result.items.filter(filterFunction)

      // Add to our collection
      allFilteredItems = [...allFilteredItems, ...filteredItems]

      // Update pagination
      nextPageParam = result.next_page_params || null

      // Break conditions
      if (!result.next_page_params) {
        break // No more pages available
      }

      if (result.items.length === 0) {
        break // Empty page returned
      }

      if (allFilteredItems.length >= limit) {
        break // We have enough items
      }
    } catch (error) {
      break
    }
  }

  const returnedItems = allFilteredItems.slice(0, limit)

  return {
    items: returnedItems,
    next_page_params:
      returnedItems && extractNextPageParam
        ? extractNextPageParam(returnedItems[returnedItems.length - 1])
        : nextPageParam,
  }
}
