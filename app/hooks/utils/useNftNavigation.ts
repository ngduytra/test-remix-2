import { useSearchParams } from "@remix-run/react"

interface UseNftNavigationProps {
  contractAddress: string
  tokenId: string
}

export const useNftNavigation = () => {
  const [, setSearchParams] = useSearchParams()

  const navigateToNft = ({ contractAddress, tokenId }: UseNftNavigationProps) => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev)
        newParams.set('collection', contractAddress)
        newParams.set('nft_id', tokenId)
        return newParams
      },
      { preventScrollReset: true },
    )
  }

  return { navigateToNft }
}
