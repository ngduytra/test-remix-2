import { useContext } from 'react'

import Dialog from './dialog'
import Button from './button'

import { ModalContext } from '@/providers/modal.provider'

import { cn } from '@/utils'

import { MODAL_NAME } from '@/constants'

export type ConfirmActionModalData = {
  message: string
  actionText: string
  onConfirm: () => void
}

const modalName = MODAL_NAME.CONFIRM_ACTION

const ConfirmActionModal = () => {
  const { closeModal, modalData } = useContext(ModalContext)
  const { message, actionText, onConfirm } = modalData[
    modalName
  ] as ConfirmActionModalData

  if (!modalData[modalName]) return null

  return (
    <Dialog
      name={modalName}
      titleClassName="!hidden"
      contentClassName={cn(
        'p-3 bg-neutral-0 backdrop-blur-lg flex w-full max-w-[480px] rounded-[32px] min-h-[unset]',
        'sm:!w-[90%] sm:pt-6 sm:top-[unset]',
      )}
      onOpenChange={() => closeModal(modalName)}
      closeClassName="sm:size-8 sm:top-3 sm:right-3"
    >
      <div className="w-full flex flex-col gap-y-3 justify-between">
        <div className="flex flex-col gap-y-4 py-3 px-5 sm:px-3 sm:pt-5">
          <span className="text-xl text-neutral-900 font-bold sm:text-lg sm:font-medium">
            {message}
          </span>
        </div>
        <div className="p-5 sm:p-3">
          <Button
            variant="primary"
            className="px-4 py-[10px] border-[1.6px] font-medium w-full"
            onClick={() => {
              onConfirm()
              closeModal(modalName)
            }}
          >
            {actionText}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default ConfirmActionModal
