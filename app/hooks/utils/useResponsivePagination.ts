import { useState, useEffect } from 'react'
import { BREAKPOINTS } from '@/constants'

interface ResponsivePaginationParams {
  rows?: number
  colsSm?: number
  colsMd?: number
  colsLg?: number
  colsXl?: number
  cols2Xl?: number
}

interface UseResponsivePaginationReturn {
  limit: number
  isMobile: boolean
  isDesktop: boolean
  currentCols: number
  currentRows: number
}

export const useResponsivePagination = ({
  rows = 2,
  colsSm = 2,
  colsMd = 3,
  colsLg = 4,
  colsXl = 5,
  cols2Xl = 6,
}: ResponsivePaginationParams = {}): UseResponsivePaginationReturn => {
  const [viewportData, setViewportData] = useState(() => {
    if (typeof window === 'undefined') {
      return { width: BREAKPOINTS.xl, isMobile: false }
    }
    const width = window.innerWidth
    return { width, isMobile: width <= BREAKPOINTS.sm }
  })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setViewportData({ width, isMobile: width <= BREAKPOINTS.sm })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getCurrentCols = (width: number) => {
    if (width < BREAKPOINTS.sm) {
      return colsSm
    }
    if (width < BREAKPOINTS.md) {
      return colsMd
    }
    if (width < BREAKPOINTS.lg) {
      return colsLg
    }
    if (width < BREAKPOINTS.xl) {
      return colsXl
    }
    return cols2Xl
  }

  const currentCols = getCurrentCols(viewportData.width)
  const currentRows = rows
  const limit = currentCols * currentRows

  return {
    limit,
    isMobile: viewportData.isMobile,
    isDesktop: !viewportData.isMobile,
    currentCols,
    currentRows,
  }
}
