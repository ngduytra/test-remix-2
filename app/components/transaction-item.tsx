import { useMemo } from 'react'
import { useNavigate } from '@remix-run/react'
import { isAddress } from 'thirdweb'
import { BigNumber } from 'bignumber.js'

import Avatar from './avatar'
import Image from './image'
import {
  ExplorerIcon,
  MintedNftIcon,
  SoldNftIcon,
  SparkIcon,
  CircleWarningIcon,
} from './icons'

import { useUserByWallet } from '@/hooks/user/useUserByWallet'
import { useNftTransferByTransaction } from '@/hooks/nft/useNftTransferByTransaction'
import { useGetCoinUsdPrice } from '@/hooks/utils'
import { useIsMobile } from '@/hooks/system/useIsMobile'
import { useCollectionByContractAddress } from '@/hooks/nft'
import { useNftMetadataByBaseUri } from '@/hooks/nft/useNftMetadataByBaseUri'

import {
  cn,
  formatCurrency,
  formatRelativeTime,
  formatAddressOrName,
  formatAddress,
  formatUsername,
  formatNumber,
  getTxExplorerUrl,
} from '@/utils'

import { TokenSymbol } from '@/constants'

import {
  DecodedInput,
  DecodedInputParams,
} from '@/types/blockscout/base-types/decodedInput'
import { Erc721TotalPayload } from '@/types/blockscout/base-types/tokenTransfer'
import { AddressParam } from '@/types/blockscout/base-types/addressParams'
import { TxType } from '@/types/dopamint-contract.type'

export type TransactionItemData = {
  hash: string
  from: AddressParam
  to: AddressParam | null
  value: string
  timestamp: string | null
  decoded_input: DecodedInput | null
}

type TransactionItemProps = {
  transaction: TransactionItemData
  baseURI?: string
  displayCollectionName?: boolean
  displayUsername?: boolean
}

const getTransactionIcon = (method: string) => {
  if (method === 'minted') {
    return <MintedNftIcon className="size-4 text-[#589013]" />
  }
  if (method === 'sold') {
    return <SoldNftIcon className="size-4 text-red-500" />
  }
  return <SparkIcon className="size-4 text-primary" />
}

const ACTION_NAME: Record<TxType, string> = {
  [TxType.mintNFT]: 'minted',
  [TxType.burnNFT]: 'sold',
  [TxType.createNFTContract]: 'created',
}

const getNftCount = (parameters: DecodedInputParams[]) => {
  const quantityParam = parameters.find((p) => p.name === 'quantity')
  const tokenIdsParam = parameters.find((p) => p.name === 'tokenIds')

  // Case for mint
  if (quantityParam) {
    return Number(quantityParam.value)
  }

  // Case for burn
  if (tokenIdsParam) {
    return (tokenIdsParam.value as string[]).length
  }

  return 1
}

const TransactionItem = ({
  transaction,
  baseURI,
  displayCollectionName = false,
  displayUsername = false,
}: TransactionItemProps) => {
  const { from, decoded_input, timestamp, hash, value, to } = transaction
  const isCreatedContractTx = transaction.decoded_input?.method_call.includes(
    TxType.createNFTContract,
  )
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const { data: userInfo } = useUserByWallet(from.hash)
  const { data: nftTransfer } = useNftTransferByTransaction(hash, 'ERC-721')

  const { data: nftMetadata } = useNftMetadataByBaseUri(baseURI ?? '', '0')
  const { data: collection } = useCollectionByContractAddress(to?.hash || '')
  const { data: ethUsdPrice } = useGetCoinUsdPrice(TokenSymbol.ETH)

  const actionName =
    ACTION_NAME[transaction.decoded_input?.method_call as TxType]

  const countEvents = getNftCount(decoded_input?.parameters ?? [])
  const collectionName = useMemo(() => {
    if (
      isCreatedContractTx &&
      !!transaction.decoded_input?.parameters?.length
    ) {
      return transaction.decoded_input?.parameters[0].value as string
    }
    if (collection) return collection.name
    return ''
  }, [collection, transaction.decoded_input?.parameters, isCreatedContractTx])

  const nftImage = useMemo(() => {
    if (nftMetadata) return nftMetadata.image

    return (
      (nftTransfer?.items?.[0]?.total as Erc721TotalPayload)?.token_instance
        ?.image_url || ''
    )
  }, [nftMetadata, nftTransfer?.items])

  const displayName = useMemo(() => {
    if (!userInfo?.username) return ''

    if (!isMobile) {
      return formatAddressOrName(userInfo.username)
    }

    if (isAddress(userInfo.username)) {
      return formatAddress(userInfo.username, 0)
    }

    return formatUsername(userInfo.username)
  }, [isMobile, userInfo?.username])

  return (
    <div
      className={cn(
        'relative flex gap-3 items-center justify-between px-5 py-3 bg-neutral-0 rounded-2xl',
        'sm:items-end sm:p-3 sm:rounded-xl sm:gap-2 sm:h-16',
        'border-2 border-transparent hover:border-primary',
        !isCreatedContractTx && 'cursor-pointer',
      )}
      onClick={() => {
        if (isCreatedContractTx) return

        open(getTxExplorerUrl(hash), '_blank')
      }}
    >
      {!isMobile ? (
        <div className="flex items-center gap-2  sm:w-full sm:gap-[6px] flex-auto sm:hidden">
          <div className="flex items-center gap-5 sm:gap-2 ">
            {getTransactionIcon(actionName)}
            {!displayUsername ? (
              <div className="flex items-center text-sm text-[#7B7B7B] w-[52px]">
                {actionName.charAt(0).toUpperCase() + actionName.slice(1)}
              </div>
            ) : (
              <div className="flex items-center gap-3 sm:gap-1">
                <Avatar
                  src={userInfo?.avatar}
                  alt="avatar"
                  className="border-none size-10 sm:size-5"
                />
                <div className="flex-1 flex">
                  <span
                    className="text-sm text-neutral-900 mr-1 cursor-pointer sm:text-[13px]"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/profile/${from.hash}`)
                    }}
                  >
                    {displayName}
                  </span>
                  <span className="text-sm text-[#7B7B7B] w-11">
                    {actionName}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-x-[6px] sm:gap-1 flex-row flex-nowrap">
            <div className="flex space-x-1 mr-1">
              <div className="size-10 bg-gradient-to-br sm:size-5 relative bg-neutral-50 pl-1 pt-1 rounded-[8px]">
                <Image
                  src={nftImage}
                  alt="nft-thumbnail"
                  className="size-full object-cover rounded-[8px] absolute"
                  error={
                    <CircleWarningIcon className="text-neutral-0 mb-[1px]" />
                  }
                />
              </div>
            </div>

            {isCreatedContractTx ? (
              <span className="text-sm text-neutral-900 font-medium sm:text-[13px]">
                {collectionName}
              </span>
            ) : (
              <>
                <span className="text-sm text-neutral-900 font-semibold sm:text-[13px] ">
                  {countEvents} NFT{countEvents > 1 ? 's' : ''}
                </span>

                {displayCollectionName && collectionName && (
                  <span>
                    from{' '}
                    <span
                      className="text-neutral-900 cursor-pointer hover:underline"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/collections/${collection?.contractAddress}`)
                      }}
                    >
                      {collectionName}
                    </span>
                  </span>
                )}
                <span className="text-sm text-[#7B7B7B] flex items-center gap-x-[2px] sm:text-[13px]">
                  <span>with value</span>&nbsp;
                  <span className="text-neutral-900 font-medium flex items-center gap-x-[1px]">
                    <span>$</span>
                    <span>
                      {formatCurrency(
                        BigNumber(ethUsdPrice)
                          .multipliedBy(formatNumber(value))
                          .toNumber(),
                      )}
                    </span>
                  </span>
                </span>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-x-[6px]">
          <div className="flex items-start gap-x-[6px]">
            {getTransactionIcon(actionName)}
          </div>
          <div className="flex flex-col gap-[2px] justify-start items-start">
            <div className="flex flex-row justify-center items-center gap-x-1">
              <div className="flex flex-row justify-center items-center gap-x-1">
                {displayUsername && (
                  <>
                    <Avatar
                      src={userInfo?.avatar}
                      alt="avatar"
                      className="border-none size-10 sm:size-5"
                    />
                    <div className="flex-1 flex">
                      <span
                        className="text-neutral-900 mr-1 cursor-pointer text-xs sm:w-10"
                        onClick={() => navigate(`/profile/${from.hash}`)}
                      >
                        {displayName}
                      </span>
                    </div>
                  </>
                )}

                <span className="text-xs text-neutral-600 w-11">
                  {!displayUsername
                    ? actionName.charAt(0).toUpperCase() + actionName.slice(1)
                    : actionName}
                </span>

                <div className="flex flex-row justify-center items-center gap-x-1">
                  <div className="bg-gradient-to-br size-5">
                    <Image
                      src={nftImage}
                      alt="nft-thumbnail"
                      className="size-full object-cover rounded-[4px]"
                      error={
                        <CircleWarningIcon className="text-neutral-0 mb-[1px]" />
                      }
                    />
                  </div>
                  {isCreatedContractTx ? (
                    <span className="text-sm text-neutral-900 font-medium sm:text-[13px] truncate w-[100px]">
                      {collectionName}
                    </span>
                  ) : (
                    <div className="flex flex-row justify-center items-center gap-x-1">
                      <span className="text-neutral-900 font-normal text-xs">
                        {countEvents} NFT{countEvents > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {!isCreatedContractTx && (
              <div className="flex flex-row justify-center items-center gap-x-1">
                {displayCollectionName && collectionName && (
                  <div className="flex flex-row justify-start items-center text-xs text-[#7B7B7B]">
                    from&nbsp;
                    <span className="text-neutral-900 w-[123px] truncate">
                      {collectionName}
                    </span>
                  </div>
                )}
                <div className="text-xs text-[#7B7B7B] flex flex-row flex-nowrap items-center ">
                  with &nbsp;
                  <span className="text-neutral-900 font-medium items-center sm:text-xs">
                    $
                    {formatCurrency(
                      BigNumber(ethUsdPrice)
                        .multipliedBy(formatNumber(value))
                        .toNumber(),
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!isCreatedContractTx && (
        <div
          className={cn(
            'flex items-center gap-x-5',
            'sm:flex-col sm:items-end sm:justify-end',
          )}
        >
          <span className="text-xs text-neutral-600 sm:text-xs">
            {formatRelativeTime(timestamp ?? '')}
          </span>

          <a
            href={getTxExplorerUrl(hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:absolute sm:top-[1.5px] sm:right-[1.5px]"
          >
            <ExplorerIcon className="text-primary-500 sm:size-[18px]" />
          </a>
        </div>
      )}
    </div>
  )
}

export default TransactionItem
