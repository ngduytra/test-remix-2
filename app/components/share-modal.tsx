import { useContext } from 'react'

import Dialog from './dialog'
import Image from './image'
import { TwitterIcon } from './icons'

import { ModalContext } from '@/providers/modal.provider'

import { MODAL_NAME } from '@/constants'
import { getShareUrl } from '@/utils'

export type ShareModalData = {
  collectionAddress: string
}

const modalName = MODAL_NAME.SHARE

const ShareModal = () => {
  const { closeModal, modalData } = useContext(ModalContext)
  const { collectionAddress } = modalData[modalName] as ShareModalData

  const onShare = (platform: 'farcaster' | 'twitter') => {
    // TODO: Implement share logic
    console.log('share', platform, collectionAddress)

    const shareUrl = getShareUrl(
      window.origin + '/collections/' + collectionAddress,
      'twitter',
    )
    window.open(shareUrl, '_blank')
  }

  return (
    <Dialog
      name={modalName}
      titleClassName="!hidden"
      contentClassName="p-0 sm:bg-dark flex sm:w-[calc(100vw-24px)] w-[480px] rounded-[32px]"
      closeClassName="right-3 top-6 sm:top-5 sm:size-8"
      onOpenChange={() => closeModal(modalName)}
    >
      <div className="w-full flex flex-col justify-between gap-y-[10px] bg-neutral-0 rounded-[32px] p-3">
        <span className="text-neutral-900 text-2xl font-bold py-4 sm:text-base">
          Choose platform to share
        </span>
        <div
          className="w-full flex flex-col items-center justify-between p-5 cursor-pointer duration-300 outline outline-[1px] hover:outline-[2px] outline-dark/[0.12] rounded-[20px] hover:outline-primary-500 hover:bg-[rgba(255,142,37,0.20)]"
          onClick={() => onShare('twitter')}
        >
          <TwitterIcon className="size-6" />
          <span className="text-neutral-900">X (Twitter)</span>
        </div>
        <div
          className="w-full flex flex-col items-center justify-between p-5 duration-300 outline outline-[1px] hover:outline-[2px] outline-dark/[0.12] rounded-[20px] hover:outline-primary-500 hover:bg-[rgba(255,142,37,0.20)] cursor-not-allowed relative"
          // onClick={() => onShare('farcaster')}
        >
          <Image src="/images/farcaster.png" imageClassName="size-7" />
          <span className="text-neutral-900">Farcaster</span>

          <span className="absolute top-[6px] right-[6px] px-3 py-[6px] rounded-full bg-neutral-25 text-neutral-900 text-sm">
            Coming soon
          </span>
        </div>
      </div>
    </Dialog>
  )
}

export default ShareModal
