import { memo, useContext, useEffect } from 'react'
import { useActiveAccount } from 'thirdweb/react'

import Button from './button'
import Image from './image'

import { useGetMintCost } from '@/hooks/nft/useGetMintCost'
import { useNft721Owner } from '@/hooks/nft/useNft721Owner'
import { useNftMetadata } from '@/hooks/nft'
import { useNftNavigation } from '@/hooks/utils/useNftNavigation'

import { eventEmitter } from '@/providers/event.provider'
import { ModalContext } from '@/providers/modal.provider'

import { APP_EVENT, MODAL_NAME } from '@/constants'

import { cn, formatToken } from '@/utils'

type NftCardProps = {
  data: {
    contractAddress: `0x${string}`
    tokenId: string
  }
  className?: string
  outerSellButtonClassName?: string
  overlayClassName?: string
  errorClassName?: string
}

const NftCard = ({
  data,
  className,
  outerSellButtonClassName,
  overlayClassName,
  errorClassName,
}: NftCardProps) => {
  const { data: mintPrice = 0n } = useGetMintCost(data)
  const { data: owner } = useNft721Owner(data.contractAddress, data.tokenId)
  const {
    data: nftMetadata,
    isLoading: isFetchingNftMetadata,
    isError: isErrorNftMetadata,
    refetch: refetchNftMetadata,
  } = useNftMetadata(data.contractAddress, data.tokenId)
  const activeAccount = useActiveAccount()
  const { navigateToNft } = useNftNavigation()

  const mintFailed =
    (!nftMetadata?.image && !isFetchingNftMetadata) || isErrorNftMetadata

  const handleNftClick = () => {
    navigateToNft({
      contractAddress: data.contractAddress,
      tokenId: data.tokenId,
    })
  }

  useEffect(() => {
    const handleRetryMint = ({
      contractAddress,
      tokenIds,
    }: {
      contractAddress: string
      tokenIds: string[]
    }) => {
      if (
        contractAddress === data.contractAddress &&
        tokenIds.includes(data.tokenId)
      ) {
        refetchNftMetadata()
      }
    }
    eventEmitter.on(APP_EVENT.NFT_RETRY_MINTED, handleRetryMint)
    return () => {
      eventEmitter.off(APP_EVENT.NFT_RETRY_MINTED, handleRetryMint)
    }
  }, [nftMetadata, data.contractAddress, data.tokenId, refetchNftMetadata])

  return (
    <div
      className={cn(
        'border border-light/[0.12] overflow-hidden w-full rounded-xl group bg-neutral-0 cursor-pointer',
        className,
      )}
      onClick={handleNftClick}
    >
      <div className="aspect-square">
        <div className="backdrop-blur-sm relative size-full">
          <Image
            src={nftMetadata?.image}
            alt={nftMetadata?.name}
            className="size-full object-cover"
            error="Generation incomplete"
            errorClassName={cn('pt-20 sm:pt-0 sm:pb-10', errorClassName)}
            forceError={mintFailed}
          />
          {owner &&
            activeAccount &&
            owner.toLowerCase() === activeAccount.address.toLowerCase() && (
              <div
                className={cn(
                  'absolute inset-0 flex justify-center items-center',
                  'z-10 sm:hidden gap-3 transition-none',
                  !mintFailed &&
                    'transition-all duration-200 ease-in-out opacity-0 group-hover:opacity-100 bg-black/30',
                  overlayClassName,
                )}
              >
                {mintFailed && (
                  <ButtonWrapper
                    variant="secondary"
                    modalName={MODAL_NAME.RETRY_MINT}
                    modalData={{
                      data,
                    }}
                    title="Retry"
                    className="w-20"
                  />
                )}
                <ButtonWrapper
                  variant="secondary"
                  modalName={MODAL_NAME.CONFIRM_SELL}
                  modalData={data}
                  title="Sell"
                  className="w-20 sm:hidden"
                />
              </div>
            )}
        </div>
      </div>
      <div className="flex flex-row justify-between text-neutral-900 p-3 sm:py-2">
        <div className="flex flex-col">
          <div className="text-neutral-600 text-[12px]">NFT ID</div>
          <div className="font-[500]">#{data?.tokenId}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-neutral-600 text-[12px]">LAST PRICE</div>
          <div className="font-[500]"> {formatToken(mintPrice)} ETH</div>
        </div>
      </div>
      <div
        className={cn('px-3 pb-3 hidden sm:block', outerSellButtonClassName)}
      >
        <ButtonWrapper
          variant="primary"
          modalName={MODAL_NAME.CONFIRM_SELL}
          modalData={data}
          title="Sell"
          className="mx-auto w-full"
        />
      </div>
    </div>
  )
}

type ButtonWrapperProps = {
  className?: string
  variant?: 'primary' | 'secondary'
  title: string
  modalName: string
  modalData: any
  onClick?: (e: React.MouseEvent) => void
}
const ButtonWrapper = memo(function ButtonWrapper({
  className,
  variant,
  title,
  modalName,
  modalData,
  onClick,
}: ButtonWrapperProps) {
  const { openModal } = useContext(ModalContext)
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(e)
        openModal(modalName, modalData)
      }}
      className={className}
    >
      {title}
    </Button>
  )
})

export default NftCard
