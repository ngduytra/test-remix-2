import { create } from 'zustand'

import { BaseScan } from '@/services/base-scan/base-scan.service'

import { NftInstance } from '@/types/blockscout/base-types/nftInstance'
import { GetNftInstancesNextPageParams } from '@/types/blockscout/address-transaction.type'

import { pause } from '@/utils'

export interface TokenBalances {
  nft721: NftInstance[]
}

export type Collection721Indexes = Map<string, number[]>

interface TokenBalancesState {
  isLoading: boolean
  balances: TokenBalances
  collection721Indexes: Collection721Indexes
  getCollection721Nfts: (collectionAddress: string) => NftInstance[] | undefined
  fetchTokenBalances?: (
    address: string,
    collectionAddresses: string[],
  ) => Promise<void>
  clearBalances: () => void
}

export const useTokenBalancesStore = create<TokenBalancesState>((set, get) => ({
  isLoading: false,
  balances: { nft721: [] },
  collection721Indexes: new Map(),
  getCollection721Nfts: (collectionAddress) => {
    const indexes = get().collection721Indexes.get(collectionAddress)
    return indexes?.map((i) => get().balances.nft721[i])
  },
  fetchTokenBalances: async (address, collectionAddresses) => {
    set((state) => ({ ...state, isLoading: true }))
    const baseScan = BaseScan.getInstance()
    let nextPageParams: GetNftInstancesNextPageParams = null
    const allNfts: NftInstance[] = []

    do {
      const result = await baseScan.getNftsByOwner(address, nextPageParams)

      if (result.items && result.items.length > 0) {
        const filteredItems = result.items.filter((nft) => {
          if (!nft?.token?.address_hash || !nft.id) return false
          const contractAddress = nft.token.address_hash.toLowerCase()
          return collectionAddresses.some(
            (addr) => addr.toLowerCase() === contractAddress,
          )
        })

        allNfts.push(...filteredItems)
      }

      nextPageParams = result.nextPageParams

      await pause(0.1)
    } while (nextPageParams)

    const groupedNFTIndexesByCollection = new Map<string, number[]>()

    allNfts.forEach((nft, i) => {
      if (groupedNFTIndexesByCollection.has(nft.token.address_hash)) {
        groupedNFTIndexesByCollection.get(nft.token.address_hash)?.push(i)
      } else {
        groupedNFTIndexesByCollection.set(nft.token.address_hash, [i])
      }
    })

    set((state) => ({
      ...state,
      balances: { ...state.balances, nft721: allNfts },
      collection721Indexes: groupedNFTIndexesByCollection,
      isLoading: false,
    }))
  },
  clearBalances: () => {
    set({
      isLoading: false,
      balances: { nft721: [] },
      collection721Indexes: new Map(),
    })
  },
}))
