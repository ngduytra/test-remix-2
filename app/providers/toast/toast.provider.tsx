import { ClientOnly } from 'remix-utils/client-only'

import ToastWrapper from './toast-wrapper'

const ToastProvider = () => {
  return <ClientOnly>{() => <ToastWrapper />}</ClientOnly>
}

export default ToastProvider
