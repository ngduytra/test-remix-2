import { useContext, useState, useMemo, useEffect, useCallback } from 'react'
import { useParams } from '@remix-run/react'
import { useActiveAccount } from 'thirdweb/react'
import { FieldValues, useForm, UseFormWatch } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'

import { ConfirmActionModalData } from '@/components/confirm-action-modal'
import SlippageButton from '@/views/collection-details/buy-tab-v2/slippage-button'
import MintSection from '@/views/collection-details/buy-tab-v2/mint-section'
import SlippagePopup from '@/views/collection-details/buy-tab-v2/slippage-popup'
import AddNftPanel from '@/views/collection-details/add-nft-panel'
import { DEFAULT_SLIPPAGE_TOLERANCE } from '@/views/collection-details/buy-tab-v2/constants'
import Dialog from './dialog'

import { useRefetchWorkflow } from '@/hooks/workflow/useRefetchWorkflow'
import { useMintCostEstimate } from '@/hooks/nft/useMintCostEstimate'
import { usePromptById } from '@/hooks/prompt/usePromptById'
import { useGetCoinUsdPrice } from '@/hooks/utils'
import { useCollectionByContractAddress } from '@/hooks/nft/useCollectionByContractAddress'
import { useGenIdByTokenId } from '@/hooks/nft/useGenIdByTokenId'

import { ModalContext } from '@/providers/modal.provider'
import { eventEmitter } from '@/providers/event.provider'

import { OrchestratorService } from '@/services/orchestrator/orchestrator.service'
import { NFTService } from '@/services/nft/nft.service'
import { ExecutePromptVariationDto } from '@/services/orchestrator/type'

import {
  calculateSlippagePrice,
  formatCurrency,
  formatToken,
  formatNumber,
  cn,
  pause,
} from '@/utils'

import { TokenSymbol, MODAL_NAME, APP_EVENT } from '@/constants'
import {
  NftDomainAction,
  PlaceholderType,
  WorkflowStatus,
  Event,
} from '@/types'

const modalName = MODAL_NAME.RETRY_MINT

type NftFormData = Record<string, string | File | null>
type FormData = {
  input: NftFormData
  slippageTolerance: number
}

export type RetryMintModalData = {
  data: {
    contractAddress: `0x${string}`
    tokenId: string
  }
}

const RetryMintModal = () => {
  const { closeModal, openModal, modalData } = useContext(ModalContext)
  const { data } = modalData[modalName] as RetryMintModalData
  const params = useParams()
  const contractAddress = params.slug as string
  const activeAccount = useActiveAccount()

  const [workflowId, setWorkflowId] = useState<string | null>(null)
  const [showSlippagePopup, setShowSlippagePopup] = useState(false)

  const { data: collection } = useCollectionByContractAddress(
    data.contractAddress,
  )
  const { data: prompt } = usePromptById(collection?.promptId!)
  const { data: ethUsdPrice } = useGetCoinUsdPrice(TokenSymbol.ETH)
  const { data: genId } = useGenIdByTokenId(contractAddress, data.tokenId)

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      input: {},
      slippageTolerance: DEFAULT_SLIPPAGE_TOLERANCE,
    },
    mode: 'onChange',
  })

  const watchedSlippage = watch('slippageTolerance')

  const { data: mintCost, isLoading: costLoading } = useMintCostEstimate(
    contractAddress,
    1,
  )

  const { data: promptResult, error: promptResultError } = useRefetchWorkflow({
    workflowId,
    expectedEvent: NftDomainAction.UpdateNftMetadata,
    expectedWorkflowStatus: WorkflowStatus.Completed,
    enabled: !!workflowId,
  })

  const { mutate: executeRetry, isPending: isMinting } = useMutation({
    mutationFn: async (formData: FormData) => {
      if (
        !contractAddress ||
        !collection?.promptId ||
        !activeAccount ||
        !genId
      ) {
        throw new Error('Missing required data')
      }

      openModal(MODAL_NAME.MINTED, {
        isLoading: true,
        closable: false,
      })

      // Step 1: Smart mapping using labels - separate text variations and image URLs
      const textPlaceholders = (prompt?.placeholders || []).filter(
        (p) => p.type === PlaceholderType.Text,
      )
      const imagePlaceholders = (prompt?.placeholders || []).filter(
        (p) => p.type === PlaceholderType.Image,
      )

      const variation: ExecutePromptVariationDto = {
        placeholders: textPlaceholders.map((p) => ({
          ...p,
          value: (formData.input[p.id] as string) || '',
        })),
        options: {
          image: imagePlaceholders.map((p) => formData.input[p.id] as string),
        },
      }

      // Step 2: Create workflow to get workflowId
      const workflow =
        await OrchestratorService.getInstance().startRetryMintWorkflow({
          variations: [variation],
          tokens: [
            { tokenId: parseInt(data.tokenId), genId: genId.toString() },
          ],
        })
      setWorkflowId(workflow.workflowId)
    },
    onError: () => {
      openModal(MODAL_NAME.MINTED, { isLoading: false })
    },
  })

  const totalPriceWithSlippage = useMemo(() => {
    if (!mintCost) return 0n
    return calculateSlippagePrice(mintCost.totalPrice, watchedSlippage)
  }, [mintCost, watchedSlippage])

  const ethPrice = formatToken(totalPriceWithSlippage)
  const usdPrice = formatCurrency(
    ethUsdPrice * formatNumber(totalPriceWithSlippage),
  )

  const isDisabled = !isValid || costLoading || isMinting

  const handleMint = (formData: FormData) => {
    if (!contractAddress || !collection?.promptId) return
    openModal<ConfirmActionModalData>(MODAL_NAME.CONFIRM_ACTION, {
      message:
        'Generating draft contains a minor AI fee. Are you sure to re-generate draft?',
      actionText: `Retry with ${ethPrice} ETH`,
      onConfirm: () => {
        executeRetry(formData)
        openModal(MODAL_NAME.MINTED, { isLoading: true })
      },
    })
  }

  const handlePromptResultComplete = useCallback(
    async (
      promptResult: Event | null | undefined,
      promptResultError: Error | null,
    ) => {
      try {
        if (promptResultError) {
          throw promptResultError
        }

        if (!promptResult) {
          return
        }

        await pause(10)
        eventEmitter.emit(APP_EVENT.NFT_RETRY_MINTED, {
          contractAddress,
          tokenIds: [data.tokenId],
        })
        const mintedNFTs = await NFTService.getInstance().getNftByIds(
          contractAddress,
          [parseInt(data.tokenId)],
        )

        openModal(MODAL_NAME.MINTED, { nftList: mintedNFTs, isLoading: false })
        closeModal(modalName)
        setWorkflowId(null)
      } catch (error) {
        setWorkflowId(null)
        openModal(MODAL_NAME.MINTED, { isLoading: false })
      }
    },
    [contractAddress, data.tokenId, openModal, closeModal],
  )

  const handleResetPanel = useCallback(() => {
    const resetData: NftFormData = {}
    if (prompt?.placeholders) {
      prompt.placeholders.forEach((placeholder) => {
        resetData[placeholder.id] =
          placeholder.type === PlaceholderType.Image ? null : ''
      })
    }
    setValue(`input`, resetData, { shouldValidate: true })
  }, [prompt?.placeholders, setValue])

  useEffect(() => {
    handlePromptResultComplete(promptResult, promptResultError)
  }, [promptResult, handlePromptResultComplete, promptResultError])

  return (
    <Dialog
      name={modalName}
      titleClassName="!hidden"
      contentClassName={cn(
        'p-3 bg-neutral-0 flex w-full max-w-full md:rounded-[32px] md:h-[40rem]',
        'md:max-w-[480px] h-screen rounded-none',
      )}
      onOpenChange={() => closeModal(modalName)}
    >
      <div className="flex w-full h-full gap-3 justify-between flex-col">
        <div className="pb-3 flex">
          <div className="relative">
            <SlippageButton
              onClick={() => setShowSlippagePopup(!showSlippagePopup)}
            />
            {showSlippagePopup && (
              <SlippagePopup
                rootClassName="right-[unset] left-0"
                isOpen={showSlippagePopup}
                slippageValue={watchedSlippage}
                onSlippageChange={(value: number) =>
                  setValue('slippageTolerance', value)
                }
                onClose={() => setShowSlippagePopup(false)}
              />
            )}
          </div>
        </div>
        {/* NFT Panels - Fixed height scrollable section */}
        <div className="overflow-y-auto hide-scrollbar pb-[124px] flex-1">
          <div className="space-y-3">
            <AddNftPanel
              register={register}
              setValue={setValue}
              watch={watch as unknown as UseFormWatch<FieldValues>}
              onReset={handleResetPanel}
              placeholders={prompt?.placeholders || []}
              errors={errors.input}
              rootName="input"
            />
          </div>
        </div>
        <div className="absolute sm:fixed bottom-0 left-0 right-0 rounded-b-[32px] overflow-hidden sm:rounded-none">
          <MintSection
            buttonName="Retry"
            ethPrice={ethPrice}
            usdPrice={usdPrice}
            isLoading={costLoading}
            isDisabled={isDisabled}
            onMint={handleSubmit(handleMint)}
            isMinting={isMinting}
          />
        </div>
        {/* Backdrop to close slippage popup */}
        {showSlippagePopup && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowSlippagePopup(false)}
          />
        )}
      </div>
    </Dialog>
  )
}

export default RetryMintModal
