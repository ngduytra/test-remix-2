import { usePrefetchAllNftsByOwner } from './usePrefetchAllNftsByOwner'
import { useResponsivePagination } from '@/hooks/utils/useResponsivePagination'
import { useState, useCallback, useMemo } from 'react'

export interface FilteredNft {
  id: string
  tokenId: string
  contractAddress: string
  image: string
  collectionName?: string | null
  owner: string
  metadata?: any
}

export const useInfiniteNftsByOwner = (owner: string) => {
  const { allDopamintNfts, isLoading, isError, totalCount } =
    usePrefetchAllNftsByOwner(owner)
  const { limit } = useResponsivePagination({
    rows: 2,
    colsSm: 2,
    colsMd: 2,
    colsLg: 3,
    colsXl: 4,
    cols2Xl: 5,
  })
  const [currentPage, setCurrentPage] = useState(1)

  const allNfts = useMemo(() => {
    return allDopamintNfts.slice(0, currentPage * limit)
  }, [allDopamintNfts, currentPage, limit])

  const hasNextPage = useMemo(() => {
    const totalPages = Math.ceil(totalCount / limit)
    return currentPage < totalPages
  }, [currentPage, totalCount, limit])

  const fetchNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [hasNextPage])

  const isFetching = false

  return {
    allNfts,
    totalCount,
    isLoading,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
  }
}
