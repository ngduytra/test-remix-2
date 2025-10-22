import Button from '@/components/button'
import { useMutation } from '@tanstack/react-query'
import { DownloadIcon } from 'lucide-react'

export const isBaseApp = () => {
  if (typeof window === 'undefined') return false
  // Check for Farcaster Miniapp SDK or Base app user agent
  // You can adjust this check if you have a more reliable way
  // @ts-expect-error: Farcaster Miniapp SDK types are not available on window
  if (
    window.farcaster &&
    window.farcaster.actions &&
    window.farcaster.actions.downloadFile
  )
    return true
  if (
    navigator.userAgent.includes('BaseAndroid') ||
    navigator.userAgent.includes('BaseiOS')
  )
    return true
  return false
}

export const downloadFile = async (url: string, filename: string) => {
  if (isBaseApp()) {
    // @ts-expect-error: Farcaster Miniapp SDK types are not available on window
    window.farcaster.actions.downloadFile({ url, filename })
    return
  }
  // Browser logic (current)
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

export default function Home() {
  const { mutateAsync: handleDownloadImage, isPending: downloading } =
    useMutation({
      mutationFn: async (url: string) => {
        await downloadFile(url, '_' + crypto.randomUUID())
      },
    })

  const handleDownloadWhitelistTemplate = (fileName: string) => {
    downloadFile(`/${fileName}`, fileName)
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
    </div>
  )
}
