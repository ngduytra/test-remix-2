import { HTMLProps, useState, useEffect } from 'react'
import { Loader } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'

import Button from '@/components/button'
import { RemoveIcon, UploadIcon } from '@/components/icons'

import { useToast } from '@/hooks/system/useToast'
import { useModal } from '@/hooks/system/useModal'

import { MediaService } from '@/services/media/media.service'

import { cn } from '@/utils/common.util'
import { MODAL_NAME } from '@/constants'

type UploadImageProps = HTMLProps<HTMLInputElement> &
  HTMLProps<HTMLImageElement> & {
    wrapperClassName?: string
    onChangeUrl: (url: string) => void
    onRemove?: () => void
    value: string | null
    shouldCrop?: boolean
  }

const UploadImage = ({
  wrapperClassName,
  alt,
  onChangeUrl,
  onRemove,
  value,
  shouldCrop = true,
  ...props
}: UploadImageProps) => {
  const [src, setSrc] = useState<string | null>(value || null)
  const { notifyError } = useToast()

  useEffect(() => {
    setSrc(value)
  }, [value])

  const { mutate: uploadFile, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const url = await MediaService.getInstance().uploadFile(file)
      setSrc(url)
      onChangeUrl(url)
    },
  })

  const { openModal } = useModal()

  return (
    <div
      className={cn(
        'flex items-center gap-x-2 justify-center relative aspect-square rounded-3xl border border-dark/[0.12] bg-neutral-0 group',
        wrapperClassName,
      )}
    >
      {src ? (
        <>
          <img
            src={src}
            className="w-full h-full object-cover rounded-3xl"
            alt={alt}
            {...props}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSrc(null)
                onRemove?.()
              }}
            >
              <RemoveIcon className="inline-block w-4 h-4" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            {...props}
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return

              // Validate file type
              if (!file.type.startsWith('image/')) {
                notifyError('Please select an image file')
                e.target.value = ''
                return
              }

              // Validate file size (max 10MB)
              if (file.size > 10 * 1024 * 1024) {
                notifyError('File size must be less than 10MB')
                e.target.value = ''
                return
              }

              if (!shouldCrop) {
                uploadFile(file)
                return
              }

              e.target.value = ''
              const img = new Image()
              img.src = URL.createObjectURL(file)
              img.onload = function () {
                if (img.width === img.height) {
                  uploadFile(file)
                  return
                }

                openModal(MODAL_NAME.CROP_IMAGE, {
                  src: img.src,
                  width: img.width,
                  height: img.height,
                  onCropComplete: (blob: Blob) => {
                    uploadFile(
                      new File([blob], file.name, {
                        type: file.type,
                      }),
                    )
                    URL.revokeObjectURL(img.src)
                  },
                })
              }
            }}
            disabled={isPending}
          />

          <div className="flex flex-col justify-center items-center gap-2 text-light/50 leading-none text-sm">
            <Button variant="neutral" size="sm" disabled={isPending}>
              {isPending ? (
                <Loader className="inline-block text-neutral-100 w-4 h-4 animate-spin" />
              ) : (
                <UploadIcon className="inline-block text-neutral-900 w-4 h-4" />
              )}
            </Button>
            <span className="text-neutral-600">Upload image</span>
          </div>
        </>
      )}
    </div>
  )
}

export default UploadImage
