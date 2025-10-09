import { useContext } from 'react'

import { ModalContext } from '@/providers/modal.provider'

export const useModal = () => {
  return useContext(ModalContext)
}
