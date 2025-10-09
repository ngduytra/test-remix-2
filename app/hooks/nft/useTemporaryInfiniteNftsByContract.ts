import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'

type NftInstance = {
  animation_url: null | string
  external_app_url: null | string
  id: string
  image_url: null | string
  is_unique: boolean
  media_type: null | string
  media_url: null | string
  metadata: null | object
  owner: {
    ens_domain_name: null
    hash: string
    implementations: string[]
    is_contract: boolean
    is_scam: boolean
    is_verified: boolean
    metadata: object
    name: null | string
    private_tags: string[]
    proxy_type: null | string
    public_tags: string[]
    watchlist_names: string[]
  }
  thumbnails: null | object
  token: {
    address_hash: string
    circulating_market_cap: null | string
    decimals: null | string
    exchange_rate: null | string
    holders_count: string
    icon_url: null | string
    name: string
    symbol: string
    total_supply: string
    type: string
    volume_24h: null | string
  }
}

type NextPageParams = {
  block_number: string
  index: number
  items_count: number
}

type NftInstanceResponse = {
  items: NftInstance[]
  next_page_params: NextPageParams | null
}

export function useTemporaryInfiniteNftsByContract(
  contractAddress: string,
  nextPage?: object,
) {
  const { data, ...rest } = useInfiniteQuery({
    queryKey: ['useTemporaryInfiniteNftsByContract', contractAddress, nextPage],
    queryFn: async ({ pageParam }: { pageParam: NextPageParams | null }) => {
      const { data } = await axios.get<NftInstanceResponse>(
        `https://base-sepolia.blockscout.com/api/v2/tokens/${contractAddress}/instances`,
        {
          params: pageParam ? { ...pageParam } : undefined,
        },
      )
      return data
    },

    getNextPageParam: (lastPage) => {
      if (!lastPage.next_page_params) return undefined
      return lastPage.next_page_params
    },
    initialPageParam: null,
    enabled: !!contractAddress,
  })

  return {
    data: data?.pages.flatMap((page) => page.items) ?? [],
    ...rest,
  }
}
