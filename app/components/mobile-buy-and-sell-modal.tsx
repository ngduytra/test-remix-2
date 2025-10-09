import { useContext } from 'react'

import Dialog from './dialog'
import BuyAndSell from '@/views/collection-details/buy-and-sell'

import { ModalContext } from '@/providers/modal.provider'
import { MODAL_NAME } from '@/constants'

const modalName = MODAL_NAME.MOBILE_BUY_AND_SELL

export default function MobileBuyAndSellModal() {
  const { closeModal } = useContext(ModalContext)

  const handleClose = () => {
    closeModal(modalName)
  }

  return (
    <Dialog
      name={modalName}
      onOpenChange={handleClose}
      titleClassName="!hidden"
      overlayClassName="inset-0"
      contentClassName="fixed inset-0 bg-neutral-0 z-[21] flex flex-col h-screen w-screen animate-move-up p-0 min-w-0 min-h-0 rounded-none border-0 shadow-none"
      closeClassName="p-2 size-9 rounded-full top-3 right-2.5"
    >
      <div className="min-h-0 pt-12">
        <BuyAndSell />
      </div>
    </Dialog>
  )
}
