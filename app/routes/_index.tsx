import Button from '@/components/button'
import { useMutation } from '@tanstack/react-query'
import { DownloadIcon, ShareIcon } from 'lucide-react'

export async function downloadFile(url: string, filename: string) {
  if (typeof window === 'undefined') return // SSR guard
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`)
  }
  const blob = await response.blob()
  const blobUrl = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = blobUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(blobUrl)
}

export const getShareUrl = (content: string, social: string) => {
  switch (social) {
    case 'twitter':
      return 'https://twitter.com/intent/tweet?text=' + content
    default:
      return ''
  }
}

export default function Home() {
  const { mutateAsync: handleDownloadImage, isPending: downloading } =
    useMutation({
      mutationFn: async (url: string) => {
        if (typeof window === 'undefined') return // SSR guard
        let isInMiniapp = false
        let sdk: any = undefined
        try {
          sdk = (await import('@farcaster/miniapp-sdk')).sdk
          isInMiniapp =
            typeof sdk?.isInMiniApp === 'function'
              ? await sdk.isInMiniApp()
              : false
        } catch (e) {
          isInMiniapp = false
        }
        if (
          isInMiniapp &&
          sdk &&
          sdk.actions &&
          typeof sdk.actions.openUrl === 'function'
        ) {
          try {
            // Format the URL to be absolute if it's not already
            let downloadUrl = url
            if (typeof window !== 'undefined' && url.startsWith('/')) {
              downloadUrl = window.location.origin + url
            }
            await sdk.actions.openUrl({ url: downloadUrl })
            return
          } catch {
            // Fallback to download if openUrl fails
          }
        }
        await downloadFile(url, '_' + crypto.randomUUID())
      },
    })

  const handleShare = () => {
    const shareUrl = getShareUrl(
      window.origin + '/collections/' + contractAddress,
      'twitter',
    )

    window.open(shareUrl, '_blank')
  }

  const handleDownloadWhitelistTemplate = async (
    fileName: string,
    displayName = fileName,
  ) => {
    if (typeof window === 'undefined') return // SSR guard
    let isInMiniapp = false
    let sdk: any = undefined
    try {
      sdk = (await import('@farcaster/miniapp-sdk')).sdk
      isInMiniapp =
        typeof sdk?.isInMiniApp === 'function' ? await sdk.isInMiniApp() : false
    } catch (e) {
      isInMiniapp = false
    }
    if (
      isInMiniapp &&
      sdk &&
      sdk.actions &&
      typeof sdk.actions.openUrl === 'function'
    ) {
      try {
        // Format the URL to be absolute if it's not already
        let downloadUrl = `/${fileName}`
        if (typeof window !== 'undefined' && downloadUrl.startsWith('/')) {
          downloadUrl = window.location.origin + downloadUrl
        }
        await sdk.actions.openUrl({ url: downloadUrl })
        return
      } catch {
        // Fallback to download if openUrl fails
      }
    }
    const link = document.createElement('a')
    link.href = `/${fileName}`
    link.download = displayName
    link.click()
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)] sm:min-h-[calc(100vh-80px)] flex-col items-center pt-8 gap-y-20 sm:pt-5 sm:gap-y-10">
      <Button
        className="h-10 w-[60px] px-5 border border-light/[0.12] rounded-full text-white bg-transparent hover:bg-[#282828b3] transition"
        onClick={() =>
          handleDownloadImage(
            'https://dopamint-dev.s3.ap-southeast-1.amazonaws.com/ai/cb248f792bb402a9.png',
          )
        }
        loading={downloading}
      >
        ddd
      </Button>

      <Button
        className="text-primary hover:text-primary bg-transparent hover:bg-transparent border-none hover:underline sm:px-1 sm:gap-1"
        variant="neutral"
        size="sm"
        onClick={() =>
          handleDownloadWhitelistTemplate('whitelist-template.csv')
        }
      >
        <DownloadIcon />
        Download template
      </Button>

      <Button
        className="h-10 w-[60px] px-5 border border-light/[0.12] rounded-full text-white bg-transparent hover:bg-[#282828b3] transition"
        onClick={() => handleShare()}
      >
        she
        <ShareIcon className="text-neutral-25" />
      </Button>
    </div>
  )
}
