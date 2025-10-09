import { useEffect } from 'react'

type Params = {
  hasNextPage: boolean
  fetchNextPage: () => void
  loadMoreMarkerRef: React.RefObject<HTMLDivElement>
  options?: IntersectionObserverInit
}

export const useLoadMoreV2 = ({
  hasNextPage,
  fetchNextPage,
  loadMoreMarkerRef,
  options,
}: Params) => {
  useEffect(() => {
    if (!hasNextPage || !loadMoreMarkerRef.current) return

    const refInstance = loadMoreMarkerRef.current
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage()
      }
    }, options)

    observer.observe(refInstance)
    return () => {
      if (refInstance) observer.unobserve(refInstance)
    }
  }, [hasNextPage, fetchNextPage, loadMoreMarkerRef, options])
}
