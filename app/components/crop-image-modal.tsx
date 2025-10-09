import { useContext, useMemo, useRef, useState } from 'react'
import {
  centerCrop,
  makeAspectCrop,
  PixelCrop,
  type Crop,
  ReactCrop,
} from 'react-image-crop'
import { useMutation } from '@tanstack/react-query'
import { useWindowSize } from '@uidotdev/usehooks'

import Dialog from './dialog'
import Button from './button'

import { useToast } from '@/hooks/system/useToast'

import { ModalContext } from '@/providers/modal.provider'
import { cn } from '@/utils'
import { MODAL_NAME } from '@/constants'

import 'react-image-crop/dist/ReactCrop.css'

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
  width: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: 'px',
        width: width,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export type CropImageModalType = {
  src: string
  width: number
  height: number
  onCropComplete: (blob: Blob) => void
}

const modalName = MODAL_NAME.CROP_IMAGE

const CropImageModal = () => {
  const imageRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const { closeModal, modalData } = useContext(ModalContext)
  const { width: windowWidth } = useWindowSize()
  const { notifyError } = useToast()
  const {
    src,
    width: originalWidth,
    height: originalHeight,
    onCropComplete,
  } = modalData[modalName] as CropImageModalType

  const { width, height } = useMemo(() => {
    const containerWidth = windowWidth ?? 0
    let maxWidth = Math.min(containerWidth * 0.9 - 32, 620)
    let maxHeight = 430

    const originalAspect = originalWidth / originalHeight
    if (maxHeight * originalAspect > maxWidth) {
      maxHeight = maxWidth / originalAspect
    } else {
      maxWidth = maxHeight * originalAspect
    }
    return { width: maxWidth, height: maxHeight }
  }, [originalWidth, originalHeight, windowWidth])

  const { mutate: handleCrop, isPending } = useMutation({
    mutationFn: async () => {
      const image = imageRef.current
      if (!image || !completedCrop) {
        throw new Error('Crop details not available')
      }

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      const offscreen = new OffscreenCanvas(
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
      )
      const ctx = offscreen.getContext('2d')
      if (!ctx) {
        throw new Error('No 2d context')
      }

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        offscreen.width,
        offscreen.height,
      )

      const blob = await offscreen.convertToBlob({
        type: 'image/jpeg',
      })

      return blob
    },
    onSuccess: (blob) => {
      onCropComplete(blob)
      closeModal(modalName)
    },
    onError: (error) => {
      notifyError(error.message ?? 'Failed to crop image')
    },
  })

  const handleImageLoad = () => {
    const croppedImage = centerAspectCrop(
      width,
      height,
      1,
      Math.min(width, height),
    )
    setCrop(croppedImage)
    setCompletedCrop(croppedImage) // Set initial completed crop
  }

  return (
    <Dialog
      name={modalName}
      titleClassName="!hidden"
      contentClassName={cn(
        'p-4 bg-neutral-0 backdrop-blur-lg flex size-[unset] border border-light/[0.12] rounded-[32px]',
        'sm:!max-w-[90%] sm:top-10',
      )}
      closeClassName="top-3 right-3 sm:top-3 sm:right-3 size-9 p-0"
      onOpenChange={() => {
        closeModal(modalName)
      }}
    >
      <div className="flex flex-col gap-y-4 w-full">
        <div className="pr-10">
          <span className="font-bold italic">Nano Banana&nbsp;</span>
          <span>model only supports uploading images with&nbsp;</span>
          <span className="font-bold italic">ratio 1:1</span>
        </div>
        <div className="mx-auto">
          <ReactCrop
            className="flex-1 min-h-0 rounded-2xl overflow-hidden"
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            keepSelection
          >
            <img
              ref={imageRef}
              src={src}
              crossOrigin="anonymous"
              onLoad={handleImageLoad}
              style={{
                width: `${width}px`,
                height: `${height}px`,
              }}
              alt="Crop target"
            />
          </ReactCrop>
        </div>

        <div className="sm:flex-1 sm:flex sm:items-end">
          <Button
            variant="primary"
            onClick={() => handleCrop()}
            loading={isPending}
            className="ml-auto w-[8rem] sm:w-full"
            size="sm"
            // Disable button if no crop is selected
            disabled={!completedCrop || completedCrop.width === 0}
          >
            Apply
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default CropImageModal
