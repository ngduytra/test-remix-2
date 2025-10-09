import { useCallback, useEffect } from 'react'

import { LOAD_MORE_THRESHOLD } from '@/constants'

type Params = {
  loadMoreMarker: React.RefObject<HTMLDivElement>
  threshold?: number
  canLoadMore: boolean
  onLoadMore: () => void
}

export const useLoadMore = ({
  loadMoreMarker,
  threshold = LOAD_MORE_THRESHOLD,
  canLoadMore,
  onLoadMore,
}: Params) => {
  const handleScroll = useCallback(() => {
    if (!loadMoreMarker.current || !canLoadMore) return

    const markerToOffset = loadMoreMarker.current.getBoundingClientRect().top
    if (window.innerHeight + threshold >= markerToOffset) {
      onLoadMore()
    }
  }, [loadMoreMarker, threshold, canLoadMore, onLoadMore])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])
}
