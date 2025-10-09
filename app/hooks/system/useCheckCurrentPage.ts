import { useLocation } from '@remix-run/react'

export const useCheckCurrentPage = (path: string) => {
  const location = useLocation()
  return location.pathname === path
}
