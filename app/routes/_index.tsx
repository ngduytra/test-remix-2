import Button from '@/components/button'
import { useMutation } from '@tanstack/react-query'
import { DownloadIcon } from 'lucide-react'

export const downloadFile = async (url: string) => {
  // For mobile webviews (like Base app), use window.open instead of blob URLs
  // This prevents app crashes and works more reliably
  try {
    // Try to open the URL in a new window/tab
    // In mobile webviews, this will trigger the native download behavior
    window.open(url, '_blank')
  } catch (error) {
    console.error('Failed to download file:', error)
    // Fallback: try direct navigation
    window.location.href = url
  }
}

export default function Home() {
  const { mutateAsync: handleDownloadImage, isPending: downloading } =
    useMutation({
      mutationFn: async (url: string) => {
        await downloadFile(url)
      },
    })

  const handleDownloadWhitelistTemplate = (fileName: string) => {
    // For mobile webviews, use window.open to trigger native download
    // instead of programmatic link clicks
    const fileUrl = `/${fileName}`
    try {
      window.open(fileUrl, '_blank')
    } catch (error) {
      console.error('Failed to open file:', error)
      // Fallback: try direct navigation
      window.location.href = fileUrl
    }
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
