import { useContext } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useParams } from '@remix-run/react'

import Dialog from './dialog'
import Image from './image'
import Button from './button'
import {
  CheckCircledIcon,
  CircleWarningIcon,
  DownloadIcon,
  ShareIcon,
  TriangleWarningIcon,
} from './icons'
import CookingImage from '@/views/create-collection/cooking-image'

import { ModalContext } from '@/providers/modal.provider'

import { cn, downloadFile, getShareUrl } from '@/utils'
import { MODAL_NAME } from '@/constants'

export type MintedModalData = {
  nftList?: {
    id: number
    name: string
    image: string
  }[]
  isLoading: boolean
  closable?: boolean
  onRetry?: () => void
}

const modalName = MODAL_NAME.MINTED

function MintedModal() {
  const params = useParams()
  const contractAddress = params.slug as string
  const { closeModal, modalData } = useContext(ModalContext)
  const {
    nftList,
    isLoading,
    closable = true,
    onRetry,
  } = modalData[modalName] as MintedModalData

  const { mutateAsync: handleDownloadImage, isPending: downloading } =
    useMutation({
      mutationFn: async (url: string) => {
        await downloadFile(url, contractAddress + '_' + crypto.randomUUID())
      },
    })

  const handleTryAgain = () => {
    closeModal(modalName)
    onRetry?.()
  }

  const handleShare = () => {
    const shareUrl = getShareUrl(
      window.origin + '/collections/' + contractAddress,
      'twitter',
    )
    window.open(shareUrl, '_blank')
  }

  const renderContent = () => {
    if (isLoading) {
      return <CookingImage className="w-full" />
    }

    if (!nftList) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-5">
          <div className="gap-x-3 flex items-center sm:flex-col">
            <TriangleWarningIcon className="size-8 sm:size-6 text-red-300 inline-block" />
            <span className="text-neutral-900 font-medium text-2xl sm:text-xl">
              Minting failed. Please try again.
            </span>
          </div>
          <Button
            variant="primary"
            className="w-[8.75rem]"
            onClick={handleTryAgain}
          >
            Try again
          </Button>
        </div>
      )
    }

    const mintedNfts = nftList.filter((nft) => !!nft.image)
    const failedNfts = nftList.length - mintedNfts.length

    return (
      <div
        className={cn(
          'w-full bg-white rounded-[32px] pt-5',
          'flex flex-col items-center justify-center gap-[10px]',
          'sm:pb-0',
        )}
      >
        <div className="flex items-center gap-3 sm:gap-2 py-2 max-w-[400px] sm:pt-8">
          <CheckCircledIcon className="text-neon-700 sm:size-6" />
          <span className="text-neutral-900 font-medium text-xl sm:text-base">
            Minted&nbsp;
            <span className="text-primary">
              {mintedNfts.length} NFT
              {mintedNfts.length > 1 ? '(s)' : null}
            </span>
            &nbsp;Successfully
          </span>
        </div>

        {failedNfts > 0 && (
          <div className="py-2 gap-y-2 max-w-[400px] sm:px-3">
            <TriangleWarningIcon className="text-red-300 mx-auto" />
            <p className="text-center text-sm text-neutral-900">
              Some of your prompts violated the policies or reached length
              limit, causing media generation failure.&nbsp;
              <span
                className="font-medium text-primary-500 underline cursor-pointer"
                onClick={handleTryAgain}
              >
                Try again!
              </span>
            </p>
          </div>
        )}

        <div className="rounded-[32px] w-full overflow-y-scroll hide-scrollbar sm:px-3">
          {nftList.map((nft, index) => (
            <div
              key={index}
              className="relative group rounded-3xl overflow-hidden max-w-[400px] mb-[10px] mx-auto"
            >
              <Image
                src={nft.image}
                alt={nft.name}
                imageClassName="size-full object-cover"
                className="w-full aspect-square"
                error={
                  <>
                    <CircleWarningIcon className="text-neutral-0 mb-[1px] size-5" />
                    <span className="text-neutral-25 text-sm">
                      Generation incomplete
                    </span>
                  </>
                }
                errorClassName="flex-col"
              />

              {!!nft.image && (
                <div
                  className={cn(
                    'absolute left-1/2 bottom-2 -translate-x-1/2 rounded-3xl',
                    'flex items-center justify-center gap-3',
                  )}
                >
                  <Button
                    className="h-10 w-[60px] px-5 border border-light/[0.12] rounded-full text-white bg-transparent hover:bg-[#282828b3] transition"
                    onClick={() => handleDownloadImage(nft.image)}
                    loading={downloading}
                  >
                    <DownloadIcon />
                  </Button>
                  <Button
                    className="h-10 w-[60px] px-5 border border-light/[0.12] rounded-full text-white bg-transparent hover:bg-[#282828b3] transition"
                    onClick={() => handleShare()}
                  >
                    <ShareIcon className="text-neutral-25" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Dialog
      name={modalName}
      titleClassName="!hidden"
      contentClassName={cn(
        'p-0 flex w-full max-w-[978px] h-[678px] z-50',
        'sm:w-[92%] sm:h-[600px]',
      )}
      closeClassName="size-12 top-6 right-6 sm:top-3 sm:right-3 sm:size-9"
      overlayClassName="bg-black/80"
      onOpenChange={() => {
        closeModal(modalName)
      }}
      closable={closable}
    >
      {renderContent()}
    </Dialog>
  )
}

export default MintedModal
