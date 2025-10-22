import Button from '@/components/button'
import { useMutation } from '@tanstack/react-query'
import { DownloadIcon } from 'lucide-react'

export const downloadFile = async (url: string, filename: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`)
  }
  const blob = await response.blob()
  const blobUrl = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none' // Ẩn thẻ a đi cho đẹp
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

  const handleDownloadWhitelistTemplate = (
    fileName: string,
    displayName = fileName,
  ) => {
    const link = document.createElement('a')
    link.href = `/${fileName}` // File path relative to public folder
    link.download = displayName // Name for downloaded file
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
    </div>
  )
}
