import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useActiveAccount } from 'thirdweb/react'
import {
  getContract,
  prepareContractCall,
  sendTransaction,
  waitForReceipt,
} from 'thirdweb'

import { NFTService } from '@/services/nft/nft.service'

import { client } from '@/configs/thirdweb.config'
import { supportChain } from '@/configs/chain.config'
import { calculateSlippagePrice } from '@/utils'
import { NFTAbi } from '@/abi'

interface MintNFTParams {
  contractAddress: string
  quantity: number
  slippageTolerance: number
}

export function useMintNFT() {
  const queryClient = useQueryClient()
  const activeAccount = useActiveAccount()

  return useMutation({
    mutationFn: async ({
      contractAddress,
      quantity,
      slippageTolerance,
    }: MintNFTParams) => {
      if (!activeAccount) {
        throw new Error('No active account')
      }

      const nftService = NFTService.getInstance()
      const { totalPrice } = await nftService.estimateMintCost(
        contractAddress,
        quantity,
      )
      const maxPrice = calculateSlippagePrice(totalPrice, slippageTolerance)

      const contract = getContract({
        client,
        address: contractAddress,
        chain: supportChain,
        abi: NFTAbi,
      })

      const transaction = prepareContractCall({
        contract,
        method:
          'function mintNFT(address, uint256) payable returns (uint256[])',
        params: [activeAccount.address, BigInt(quantity)],
        value: maxPrice,
      })

      const result = await sendTransaction({
        account: activeAccount,
        transaction,
      })
      await waitForReceipt(result)
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ['collection-onchain-data', variables.contractAddress],
      })
      queryClient.invalidateQueries({
        queryKey: [
          'nft-enhanced-collection-by-contract',
          variables.contractAddress,
        ],
      })
    },
    onError: (err) => {
      // Keep for debugging purpose
      console.error({ err })
    },
  })
}
