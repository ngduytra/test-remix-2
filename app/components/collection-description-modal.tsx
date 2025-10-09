import { useContext } from 'react'

import Dialog from './dialog'

import { MODAL_NAME } from '@/constants'
import { ModalContext } from '@/providers/modal.provider'

import { cn } from '@/utils'

export type CollectionDescriptionModalData = {
  description: string
}

const modalName = MODAL_NAME.COLLECTION_DESCRIPTION

function CollectionDescriptionModal() {
  const { closeModal, modalData } = useContext(ModalContext)

  const { description } = modalData[modalName] as CollectionDescriptionModalData

  return (
    <Dialog
      name={modalName}
      titleClassName="hidden"
      contentClassName={cn(
        'px-5 py-5 w-full max-w-[480px] max-h-[282px] rounded-[32px] min-h-fit',
        'sm:w-[92%] sm:overflow-y-visible',
      )}
      closeClassName="top-[-40px] right-0 size-8 p-0"
      onOpenChange={() => {
        closeModal(modalName)
      }}
      closable={true}
    >
      <div
        className="text-sm text-neutral-900 max-h-[238px] overflow-y-auto hide-scrollbar"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {description}
      </div>
    </Dialog>
  )
}

export default CollectionDescriptionModal
