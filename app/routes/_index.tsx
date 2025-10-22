import Button from '@/components/button'
import { useMutation } from '@tanstack/react-query'
import { DownloadIcon } from 'lucide-react'

export const downloadFile = async (url: string, filename?: string) => {
  // Try Farcaster Miniapp SDK if available
  if (typeof window !== 'undefined') {
    // @ts-expect-error: Farcaster Miniapp SDK types are not available on window
    if (
      window.farcaster &&
      window.farcaster.actions &&
      window.farcaster.actions.downloadFile
    ) {
      // @ts-expect-error: Farcaster Miniapp SDK types are not available on window
      window.farcaster.actions.downloadFile({ url, filename: filename || '' })
      return
    }
  }
  // Fallback: Browser method
  try {
    const a = document.createElement('a')
    a.href = url
    if (filename) a.download = filename
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } catch (error) {
    console.error('Failed to download file:', error)
    window.location.href = url
  }
}

export default function Home() {
  const { mutateAsync: handleDownloadImage, isPending: downloading } =
    useMutation({
      mutationFn: async (url: string) => {
        await downloadFile(url, '_' + crypto.randomUUID())
      },
    })

  const handleDownloadWhitelistTemplate = (fileName: string) => {
    const fileUrl = `/${fileName}`
    downloadFile(fileUrl, fileName)
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
