import { useCallback } from 'react'

import { useToastStore } from '@/stores/useToastStore'

import { ToastType } from '../../types'

export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast)

  const notifySuccess = useCallback(
    (message: string) => addToast({ type: ToastType.Success, message }),
    [addToast],
  )

  const notifyError = useCallback(
    (message: string) => addToast({ type: ToastType.Error, message }),
    [addToast],
  )

  const notifyWarning = useCallback(
    (message: string) => addToast({ type: ToastType.Warning, message }),
    [addToast],
  )

  return { notifySuccess, notifyError, notifyWarning }
}
