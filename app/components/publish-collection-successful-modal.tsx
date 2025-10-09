import { useContext } from 'react'
import { useMutation } from '@tanstack/react-query'
import { shortenAddress } from 'thirdweb/utils'

import Dialog from './dialog'
import Button from './button'
import Image from './image'
import HiddenBorderRadius from './hidden-border-radius'
import {
  CheckedWithCircleIcon,
  DownloadIcon,
  OpenInNewTabIcon,
  ShareIcon,
  TelegramIcon,
  TwitterIcon,
  WebsiteIcon,
} from './icons'
import Tooltip from './tooltip'

import { useIsMobile } from '@/hooks/system/useIsMobile'
import { useCollectionByContractAddress } from '@/hooks/nft'

import { ModalContext } from '@/providers/modal.provider'

import { downloadFile, isValidUrl } from '@/utils'

import { MODAL_NAME } from '@/constants'

export type PublishCollectionSuccessfulModalData = {
  url: string
  collectionAddress: string
  name: string
  description: string
  socialLinks?: { telegram?: string; twitter?: string; website?: string }
}

const modalName = MODAL_NAME.PUBLISH_COLLECTION_SUCCESSFUL

const PublishCollectionSuccessfulModal = () => {
  const isMobile = useIsMobile()
  const { closeModal, modalData, openModal } = useContext(ModalContext)
  const { url, collectionAddress, description, name, socialLinks } = modalData[
    modalName
  ] as PublishCollectionSuccessfulModalData
  const { data: collection } = useCollectionByContractAddress(collectionAddress)
  const { telegram, twitter, website } = socialLinks || {}

  // Validate social links
  const validTelegram = telegram && isValidUrl(telegram) ? telegram : undefined
  const validTwitter = twitter && isValidUrl(twitter) ? twitter : undefined
  const validWebsite = website && isValidUrl(website) ? website : undefined

  const { mutateAsync: handleDownloadImage, isPending: downloading } =
    useMutation({
      mutationFn: async () => {
        await downloadFile(url, collectionAddress + '_' + crypto.randomUUID())
      },
    })

  const handleOpenCollection = () => {
    window.open('/collections/' + collectionAddress, '_blank')
  }

  const handleShare = () => {
    openModal(MODAL_NAME.SHARE, {
      collectionAddress: collectionAddress,
    })
  }

  const handleOpenSocial = (url: string) => {
    window.open(url, '_blank')
  }

  if (!modalData[modalName]) return null

  return (
    <Dialog
      name={modalName}
      titleClassName="!hidden"
      contentClassName="flex sm:w-full w-[455px] !h-[755px] sm:!h-full min-h-[unset] rounded-[32px] sm:top-[unset] sm:max-h-full border-none"
      closeClassName="right-5 top-8 sm:top-5 sm:right-4 sm:size-9"
      overlayClassName="sm:bg-neutral-0"
      onOpenChange={() => {
        closeModal(modalName)
      }}
    >
      <div className="w-full flex flex-col justify-between sm:justify-start gap-y-[10px] bg-neutral-0 rounded-[32px] p-5 sm:p-4">
        <div className="h-[56px] sm:h-12 sm:px-0 w-full flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <CheckedWithCircleIcon className="text-neon-700 sm:size-6" />
            <span className="text-neutral-900 font-bold text-2xl sm:text-base">
              Published Successfully
            </span>
          </div>
        </div>
        <div>
          <Image
            src={url}
            className="min-h-0 flex-1 rounded-3xl sm:flex-none"
            imageClassName="w-[415px] sm:w-full aspect-square rounded-3xl object-cover"
            style={{
              filter: 'url(#filter-radius)',
            }}
            initialHeight={isMobile ? '300px' : undefined}
          />
          <HiddenBorderRadius stdDeviation={isMobile ? 3 : 10} />
        </div>
        <div>
          <span className="text-neutral-900 font-bold sm:text-sm">{name}</span>
        </div>
        <Tooltip content={description}>
          <p className="text-neutral-600 text-ellipsis text-ellipsis-2 sm:text-[13px]">
            {description}
          </p>
        </Tooltip>
        <div className="w-full flex items-center justify-between text-sm sm:text-[13px]">
          <span className="text-neutral-600">
            Created by
            <span className="text-neutral-900 font-medium">
              {' '}
              {collection?.owner && shortenAddress(collection?.owner)}
            </span>
          </span>
          <div className="flex gap-x-3">
            {validWebsite && (
              <div
                onClick={() => handleOpenSocial(validWebsite)}
                className="sm:size-9 cursor-pointer size-10 rounded-full flex items-center justify-center bg-neutral-0 border border-dark/[0.12] backdrop-blur-[50px] shadow-[2px_4px_16px_0_rgba(248,248,248,0.06)_inset]"
              >
                <WebsiteIcon className="text-neutral-900" />
              </div>
            )}
            {validTwitter && (
              <div
                onClick={() => handleOpenSocial(validTwitter)}
                className="sm:size-9 cursor-pointer size-10 rounded-full flex items-center justify-center bg-neutral-0 border border-dark/[0.12] backdrop-blur-[50px] shadow-[2px_4px_16px_0_rgba(248,248,248,0.06)_inset]"
              >
                <TwitterIcon className="text-neutral-900" />
              </div>
            )}
            {validTelegram && (
              <div
                onClick={() => handleOpenSocial(validTelegram)}
                className="sm:size-9 cursor-pointer size-10 rounded-full flex items-center justify-center bg-neutral-0 border border-dark/[0.12] backdrop-blur-[50px] shadow-[2px_4px_16px_0_rgba(248,248,248,0.06)_inset]"
              >
                <TelegramIcon className="text-neutral-900" />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-x-3 sm:absolute sm:bottom-5 sm:left-5 sm:right-5">
          <Button
            variant="neutral"
            loading={downloading}
            onClick={() => handleDownloadImage()}
            className="sm:h-10"
          >
            <DownloadIcon />
          </Button>
          <Button
            variant="primary"
            onClick={() => handleShare()}
            className="flex-1 flex items-center gap-x-[6px] font-medium text-sm sm:text-[13px] sm:h-10 sm:!px-4 sm:flex-none"
          >
            Share
            <ShareIcon className="mb-1 sm:mb-[2px]" />
          </Button>
          <Button
            variant="primary"
            onClick={() => handleOpenCollection()}
            className="whitespace-nowrap flex-1 items-center gap-x-[6px] font-medium text-sm sm:text-[13px] sm:h-10 sm:!px-4"
          >
            Go to collection
            <OpenInNewTabIcon className="sm:size-4 mb-[2px]" />
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default PublishCollectionSuccessfulModal
