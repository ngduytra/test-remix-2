import { useEffect, useState } from 'react'
import { BREAKPOINTS } from '@/constants'

export const useIsMobile = (breakpoint = BREAKPOINTS.md): boolean => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < breakpoint
  })

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [breakpoint])

  return isMobile
}
