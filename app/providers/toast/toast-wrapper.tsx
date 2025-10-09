import { useEffect } from 'react'
import * as Toast from '@radix-ui/react-toast'

import { useToastStore } from '@/stores/useToastStore'

import {
  ToastErrorIcon,
  ToastWarningIcon,
  ToastSuccessIcon,
} from '@/components/icons'

import { cn } from '@/utils'
import { TOAST_DURATION } from '@/constants'
import { ToastType } from '@/types'

const ToastWrapper = () => {
  const { toasts, removeToast } = useToastStore()

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        removeToast(toasts[0].id)
      }, TOAST_DURATION)
      return () => clearTimeout(timer)
    }
  }, [toasts, removeToast])

  // TODO: update some UI here

  return (
    <Toast.Provider swipeDirection="right">
      {toasts.map((toast) => (
        <Toast.Root
          key={toast.id}
          className={cn(
            'pl-2 pr-4 py-2 bg-[rgb(18,18,18)]/70 rounded-[32px]',
            'outline outline-1 outline-offset-[-1px] outline-lime-300',
            'shadow-[0_-4px_12px_0_rgba(0,0,0,0.15)_inset,0_0_4px_1px_rgba(255,255,255,0.25)_inset,0_45px_13px_0_rgba(0,0,0,0.00),0_29px_12px_0_rgba(0,0,0,0.02),0_16px_10px_0_rgba(0,0,0,0.08),0_7px_7px_0_rgba(0,0,0,0.13),0_2px_4px_0_rgba(0,0,0,0.15)]',
            'backdrop-blur-md inline-flex justify-start items-center gap-3 overflow-hidden',
          )}
        >
          {getToastIcon(toast.type)}
          <div className="flex-1 font-medium text-shade1-100">
            {toast.message}
          </div>
        </Toast.Root>
      ))}

      <Toast.Viewport className="fixed top-[90px] left-1/2 -translate-x-1/2 flex flex-col gap-2 max-w-[30rem] sm:max-w-[22.5rem] w-max z-50" />
    </Toast.Provider>
  )
}

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case ToastType.Success:
      return <ToastSuccessIcon />
    case ToastType.Error:
      return <ToastErrorIcon />
    case ToastType.Warning:
      return <ToastWarningIcon />
  }
}

export default ToastWrapper
