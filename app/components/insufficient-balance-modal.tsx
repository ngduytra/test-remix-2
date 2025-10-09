import { useContext } from 'react'

import Dialog from './dialog'
import Button from './button'
import { ErrorIcon } from './icons'

import { ModalContext } from '@/providers/modal.provider'
import { MODAL_NAME } from '@/constants'

const modalName = MODAL_NAME.INSUFFICIENT_BALANCE

const InsufficientBalanceModal = () => {
  const { closeModal } = useContext(ModalContext)

  return (
    <Dialog
      name={modalName}
      titleClassName="!hidden"
      contentClassName="p-3 bg-neutral-900 backdrop-blur-lg flex w-full max-w-[480px] !h-[250px] min-h-[unset]"
      closeClassName="hidden"
      onOpenChange={() => closeModal(modalName)}
    >
      <div className="w-full flex flex-col justify-between">
        <div className="flex flex-col gap-y-4 py-3 px-5">
          <div className="size-12 rounded-full border-[1.25px] border-light/[0.12] bg-[#1C1C1C] flex items-center justify-center">
            <ErrorIcon />
          </div>
          <span className="text-2xl text-neutral-25 font-bold">
            You do not have enough balance!
          </span>
        </div>
        <div className="p-5 flex justify-end gap-x-3">
          <Button variant="secondary" onClick={() => closeModal(modalName)}>
            Cancel
          </Button>
          <Button variant="primary" className="px-8">
            Deposit
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default InsufficientBalanceModal
