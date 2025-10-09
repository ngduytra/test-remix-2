import { useContext } from 'react'
import { useSendTransaction } from 'thirdweb/react'
import { waitForReceipt } from 'thirdweb'
import { Address } from 'thirdweb/utils'
import { BigNumber } from 'bignumber.js'
import { useMutation } from '@tanstack/react-query'

import Dialog from './dialog'
import Image from './image'
import Button from './button'

import { ModalContext } from '@/providers/modal.provider'

import { useGetCoinUsdPrice } from '@/hooks/utils'
import { useBurnRefundCurrent } from '@/hooks/nft/useBurnRefundCurrent'
import { useToast } from '@/hooks/system/useToast'
import { useNftMetadata } from '@/hooks/nft'

import { NFTService } from '@/services/nft/nft.service'

import { eventEmitter } from '@/providers/event.provider'

import { cn, formatCurrency, formatNumber, formatToken, pause } from '@/utils'

import { APP_EVENT, MODAL_NAME, TokenSymbol } from '@/constants'

export type ConfirmSellModalType = {
  contractAddress: Address
  tokenId: string
}

const modalName = MODAL_NAME.CONFIRM_SELL

const ConfirmSellModal = () => {
  const { mutateAsync: sendTx } = useSendTransaction()
  const { data: ethPrice } = useGetCoinUsdPrice(TokenSymbol.ETH)
  const { closeModal, modalData } = useContext(ModalContext)
  const data = modalData[modalName] as ConfirmSellModalType
  const { notifySuccess, notifyError } = useToast()
  const { data: nftMetadata } = useNftMetadata(
    data.contractAddress,
    data.tokenId,
  )

  const { data: { refund = 0n } = {} } = useBurnRefundCurrent(
    data.contractAddress as Address,
  )

  const { mutate: handleSell, isPending: selling } = useMutation({
    mutationFn: async () => {
      const transaction = await NFTService.getInstance().getSellNftTransaction({
        contractAddress: data.contractAddress,
        tokenId: data.tokenId,
      })
      const txReceipt = await sendTx(transaction)
      await waitForReceipt(txReceipt)
    },
    onSuccess: async () => {
      await pause(10)
      eventEmitter.emit(APP_EVENT.NFT_BURNED, {
        contractAddress: data.contractAddress,
        tokenId: data.tokenId,
      })
      closeModal(modalName)
      notifySuccess('Sold successfully')
    },
    onError: () => {
      notifyError('Failed to sell NFT')
    },
  })

  return (
    <Dialog
      name={modalName}
      titleClassName="!hidden"
      contentClassName={cn(
        'p-3 bg-neutral-0 backdrop-blur-lg flex w-full w-full max-w-[480px] border border-light/[0.12] rounded-[32px]',
        'sm:!w-[90%] sm:min-h-[unset] ',
      )}
      closeClassName="top-4 right-4 sm:top-3 sm:right-3 sm:size-9"
      onOpenChange={() => {
        closeModal(modalName)
      }}
      closable={!selling}
    >
      {!!data && (
        <div className="flex-1 space-y-3">
          <div className="px-5 py-3 sm:px-3 sm:py-1.5">
            <span className="text-neutral-900 text-[1.75rem] sm:text-base font-medium">
              Sell item
            </span>
          </div>
          <div className="py-4 px-5 sm:p-3 bg-neutral-50 border border-light/[0.12] rounded-[20px] flex items-center justify-between gap-x-4 sm:gap-x-3">
            <div className="flex gap-x-3 items-center sm:gap-x-[0.375rem]">
              <Image
                src={nftMetadata?.image}
                alt="nft"
                className="rounded-[12px] overflow-hidden flex-shrink-0"
                imageClassName="size-[3.75rem] sm:size-10 object-cover"
              />
              <div className="space-y-1">
                <span className="sm:text-sm text-neutral-900 tracking-[-0.2px] line-clamp-2">
                  {nftMetadata?.name}
                </span>
              </div>
            </div>
            <div className="space-y-1 flex-shrink-0">
              <div className="bg-light/[0.08] rounded-lg h-7">
                <span className="text-[1.125rem] sm:text-sm text-neutral-900 font-medium">
                  {formatToken(refund)} ETH
                </span>
              </div>
              <span className="block text-neutral-600 text-sm sm:text-[0.75rem] text-right">
                $
                {formatCurrency(
                  BigNumber(ethPrice)
                    .multipliedBy(formatNumber(refund))
                    .toNumber(),
                )}
              </span>
            </div>
          </div>
          <div className="py-5 sm:py-3">
            <Button
              size="md"
              onClick={() => handleSell()}
              loading={selling}
              className="w-full"
            >
              Sell with {formatToken(refund)} ETH
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  )
}

export default ConfirmSellModal
