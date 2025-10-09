import { useEffect, useContext } from 'react'
import { useSearchParams } from '@remix-run/react'
import { isAddress } from 'thirdweb/utils'

import { NftDetailsModalData } from './nft-details-modal'

import { ModalContext } from '@/providers/modal.provider'
import { MODAL_NAME } from '@/constants'

export default function GlobalNftModal() {
  const { closeModal, openModal } = useContext(ModalContext)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const contractAddress = searchParams.get('collection')
    const nftId = searchParams.get('nft_id')
    const isValidRequest =
      contractAddress && nftId && isAddress(contractAddress)

    if (!isValidRequest) return

    const handleModalClose = () => {
      closeModal(MODAL_NAME.NFT_DETAILS)
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev)
          newParams.delete('collection')
          newParams.delete('nft_id')
          return newParams
        },
        { preventScrollReset: true },
      )
    }

    openModal<NftDetailsModalData>(MODAL_NAME.NFT_DETAILS, {
      contractAddress,
      tokenId: nftId,
      onModalClose: handleModalClose,
      onPointerDownOutside: handleModalClose,
    })
  }, [searchParams, closeModal, openModal, setSearchParams])

  return null
}
