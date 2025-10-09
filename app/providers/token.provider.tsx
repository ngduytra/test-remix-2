import { useEffect } from 'react'
import { useActiveAccount } from 'thirdweb/react'

import { useTokenBalancesStore } from '@/stores/useTokenBalanceStore'
import { useGetAllCollectionAddresses } from '@/hooks/nft/useGetAllCollectionAddresses'

export const TokenProvider = () => {
  const activeAccount = useActiveAccount()
  const { data: collectionAddresses = [] } = useGetAllCollectionAddresses()
  const { fetchTokenBalances } = useTokenBalancesStore()

  useEffect(() => {
    // eslint-disable-next-line no-extra-semi
    ;(async () => {
      if (!activeAccount?.address) return
      if (collectionAddresses.length === 0) return
      if (!fetchTokenBalances) return

      await fetchTokenBalances(activeAccount.address, collectionAddresses)
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccount, collectionAddresses])

  return <div />
}
