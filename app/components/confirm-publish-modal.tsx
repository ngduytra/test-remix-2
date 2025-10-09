import { useCallback, useContext, useState } from 'react'
import { BigNumber } from 'bignumber.js'
import { getAddress, waitForReceipt } from 'thirdweb'
import { useActiveAccount, useSendTransaction } from 'thirdweb/react'
import { useMutation } from '@tanstack/react-query'
import { StandardMerkleTree } from '@openzeppelin/merkle-tree'

import Button from '@/components/button'
import Dialog from '@/components/dialog'
import Image from '@/components/image'
import { PublishCollectionInfo } from '@/views/create-collection/publish-collection-modal'

import { ModalContext } from '@/providers/modal.provider'

import { useGetCoinUsdPrice } from '@/hooks/utils'
import { useToast } from '@/hooks/system/useToast'

import { OrchestratorService } from '@/services/orchestrator/orchestrator.service'
import { NFTService } from '@/services/nft/nft.service'

import {
  bytes20ToAddress,
  cn,
  formatCurrency,
  formatNumber,
  formatToken,
  pause,
} from '@/utils'
import {
  DEFAULT_WHITELIST_SUPPLY,
  DEPLOY_COLLECTION_PRICE,
  MAX_MINTABLE_PER_WALLET,
  MODAL_NAME,
  NFT_CREATED_TOPIC,
  TokenSymbol,
} from '@/constants'

import {
  AiDomainAction,
  EventStatus,
  NftDomainAction,
  WorkflowStatus,
} from '@/types'
import { PublishCollectionSuccessfulModalData } from './publish-collection-successful-modal'

export type ConfirmPublishModalData = {
  imageUrl: string
  publishInfo: PublishCollectionInfo
  promptId: string
  onDone: () => void
}

const modalName = MODAL_NAME.CONFIRM_PUBLISH_COLLECTION

function ConfirmPublishModal() {
  const { data: ethPrice } = useGetCoinUsdPrice(TokenSymbol.ETH)
  const account = useActiveAccount()
  const { mutateAsync: sendTx } = useSendTransaction()
  const { notifyError } = useToast()
  const { closeModal, openModal, modalData } = useContext(ModalContext)
  const [tempData, setTempData] = useState<{
    collectionAddress: string
    url: string
    workflowId: string
  } | null>(null)
  const { imageUrl, publishInfo, promptId, onDone } = modalData[
    modalName
  ] as ConfirmPublishModalData

  const { mutate: handlePublishCollection, isPending: publishing } =
    useMutation({
      mutationFn: async () => {
        const socials = Object.fromEntries(
          Object.entries(publishInfo.socials || {}).filter(([, value]) =>
            value?.trim(),
          ),
        )

        const { workflowId } =
          await OrchestratorService.getInstance().publishCollectionWorkflow({
            promptId,
            name: publishInfo.name,
            description: publishInfo.description,
            ...(Object.keys(socials).length > 0 && { socials }),
          })

        const { collectionId, collectionBaseUri } =
          await fetchCollectionInfoInterval(workflowId)

        let whitelistConfig = {
          merkleRoot:
            '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
          startTime: BigInt(0),
          endTime: BigInt(0),
          maxPerWallet: BigInt(0),
          maxNFTForWhitelist: BigInt(0),
        }

        if (publishInfo.whitelist.enabled) {
          const csvRows = ['Address', ...publishInfo.whitelist.addresses]
          const csv = csvRows.join('\n')
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
          const file = new File([blob], 'whitelist.csv', {
            type: 'text/csv',
            lastModified: new Date().getTime(),
          })

          const startTime = Math.round(Date.now() / 1000)
          const endTime = startTime + Number(publishInfo.whitelist.duration)
          const whitelistSupply =
            publishInfo.whitelist.supply || DEFAULT_WHITELIST_SUPPLY

          const treeData = publishInfo.whitelist.addresses.map((address) => [
            collectionId,
            address,
            MAX_MINTABLE_PER_WALLET,
            whitelistSupply,
            startTime,
            endTime,
          ])

          const standardTree = StandardMerkleTree.of(
            treeData,
            ['uint256', 'address', 'uint256', 'uint256', 'uint256', 'uint256'],
            { sortLeaves: true },
          )
          whitelistConfig = {
            merkleRoot: standardTree.root as `0x${string}`,
            startTime: BigInt(startTime),
            endTime: BigInt(endTime),
            maxPerWallet: BigInt(MAX_MINTABLE_PER_WALLET),
            maxNFTForWhitelist: BigInt(whitelistSupply),
          }

          await NFTService.getInstance().uploadWhitelistCsv(
            collectionId,
            file,
            {
              merkleRoot: whitelistConfig.merkleRoot,
              startTime: startTime,
              endTime: endTime,
              maxPerWallet: MAX_MINTABLE_PER_WALLET,
              maxNFTForWhitelist: whitelistSupply,
            },
          )
        }

        const preparedTx = await NFTService.getInstance().createCollection({
          name: publishInfo.name,
          symbol: publishInfo.name,
          tokenBaseURI: collectionBaseUri,
          collectionId,
          mintTo: account!.address,
          whitelist: whitelistConfig,
        })

        const txReceipt = await sendTx(preparedTx)
        const { logs } = await waitForReceipt(txReceipt)
        const nftCreatedLog = logs.find(
          (log) => log.topics[0] === NFT_CREATED_TOPIC,
        )
        if (!nftCreatedLog) {
          throw new Error('Failed to deploy collection')
        }
        const collectionAddress = getAddress(
          bytes20ToAddress(nftCreatedLog.topics[1] as string),
        )

        setTempData({
          collectionAddress,
          url: imageUrl,
          workflowId,
        })
        await fetchCollectionDeploymentInfoInterval(workflowId)
        return {
          collectionAddress,
          url: imageUrl,
          name: publishInfo.name,
          description: publishInfo.description,
          socialLinks: {
            website: publishInfo.socials?.website,
            twitter: publishInfo.socials?.x,
            telegram: publishInfo.socials?.telegram,
          },
        }
      },
      onError: async (error: any) => {
        //retry last time
        if (tempData && error.status === 500) {
          await pause(3)
          const { collectionAddress, url, workflowId } = tempData
          const workflow =
            await OrchestratorService.getInstance().getWorkflowById(workflowId)
          const { status, action } = workflow.events[workflow.events.length - 1]
          if (
            action === AiDomainAction.UpdatePromptStatus &&
            status === EventStatus.Succeeded
          ) {
            openModal<PublishCollectionSuccessfulModalData>(
              MODAL_NAME.PUBLISH_COLLECTION_SUCCESSFUL,
              {
                collectionAddress,
                url,
                name: publishInfo.name,
                description: publishInfo.description,
                socialLinks: {
                  website: publishInfo.socials?.website,
                  twitter: publishInfo.socials?.x,
                  telegram: publishInfo.socials?.telegram,
                },
              },
            )
            onDone()
            return
          }
        }

        notifyError(error.message)
        setTempData(null)
      },
      onSuccess: (data) => {
        if (!data) {
          return
        }

        openModal<PublishCollectionSuccessfulModalData>(
          MODAL_NAME.PUBLISH_COLLECTION_SUCCESSFUL,
          data,
        )
        onDone()
      },
    })

  const fetchCollectionInfoInterval = useCallback(
    async (workflowId: string) => {
      let retryCount = 0
      while (retryCount <= 30) {
        retryCount++

        await pause(2)
        const workflow =
          await OrchestratorService.getInstance().getWorkflowById(workflowId)
        const { status, action, payload } =
          workflow.events[workflow.events.length - 1]

        if (
          status === EventStatus.Succeeded &&
          action === NftDomainAction.CreateCollection
        ) {
          return payload as {
            collectionId: string
            collectionBaseUri: string
          }
        }
        if (action !== NftDomainAction.CreateCollection) {
          continue
        }
        if (status === EventStatus.Failed) {
          break
        }
      }

      throw new Error('Failed to create collection')
    },
    [],
  )

  const fetchCollectionDeploymentInfoInterval = useCallback(
    async (workflowId: string) => {
      let retryCount = 0

      while (retryCount <= 20) {
        retryCount++
        await OrchestratorService.getInstance().continuePublishCollectionWorkflow(
          workflowId,
        )
        await pause(8)
        let workflow = await OrchestratorService.getInstance().getWorkflowById(
          workflowId,
        )
        const { status, action } = workflow.events[workflow.events.length - 1]
        if (
          action === AiDomainAction.UpdatePromptStatus &&
          status === EventStatus.Succeeded
        ) {
          return
        }

        if (action !== AiDomainAction.UpdatePromptStatus) {
          continue
        }
        if (status === EventStatus.Failed) {
          break
        }

        let statusRetryCount = 0
        while (
          workflow.status === WorkflowStatus.Processing &&
          statusRetryCount <= 10
        ) {
          statusRetryCount++
          await pause(1)
          workflow = await OrchestratorService.getInstance().getWorkflowById(
            workflowId,
          )
        }
        // if workflow is still stuck in processing, break
        if (workflow.status === WorkflowStatus.Processing) {
          break
        }
      }

      throw new Error('Failed to verify collection deployment')
    },
    [],
  )

  return (
    <Dialog
      name={MODAL_NAME.CONFIRM_PUBLISH_COLLECTION}
      titleClassName="hidden"
      contentClassName={cn(
        'p-3 md:w-full max-w-[480px] lg:h-[624px] rounded-[32px]',
        'w-[92%] sm:top-[unset]',
      )}
      onOpenChange={() => {
        if (publishing) {
          return
        }
        closeModal(MODAL_NAME.CONFIRM_PUBLISH_COLLECTION)
      }}
      closable={!publishing}
    >
      <div className="w-full flex flex-col gap-y-3 justify-center items-center">
        <div className="w-full flex flex-col gap-y-[6px] px-5 py-3 sm:px-3">
          <h1 className="text-neutral-900 text-2xl font-bold sm:text-base">
            Confirm to publish this collection?
          </h1>
          <h3 className="text-neutral-600 text-base sm:text-sm">
            If you publish this collection it can not be hidden.
          </h3>
        </div>
        <div className="w-[456px] py-8 rounded-xl bg-neutral-900/[0.08] sm:p-3 sm:w-full">
          <div className="w-[352px] sm:w-full aspect-square mx-auto relative">
            <Image
              src={imageUrl}
              alt="collection-card-image"
              className="object-contain rounded-xl aspect-square"
            />
          </div>
        </div>
        <div
          className={cn(
            'flex items-center justify-between py-5 px-8 w-full',
            'sm:flex-col sm:items-start sm:gap-y-[10px] sm:pt-0 sm:pb-3 sm:px-3',
          )}
        >
          <div className="flex flex-col gap-1">
            <span className="text-sm text-neutral-600">Creation fee</span>
            <span className="text-neutral-900 text-lg font-medium">
              {formatToken(DEPLOY_COLLECTION_PRICE)} ETH
              <span className="text-neutral-600 text-sm font-normal ml-1">
                {formatCurrency(
                  BigNumber(ethPrice)
                    .multipliedBy(formatNumber(DEPLOY_COLLECTION_PRICE))
                    .toNumber(),
                )}
                $
              </span>
            </span>
          </div>
          <Button
            className="w-[160px] sm:w-full"
            onClick={() => handlePublishCollection()}
            loading={publishing}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default ConfirmPublishModal
