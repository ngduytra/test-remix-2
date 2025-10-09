import { HTMLProps, useEffect, useState } from 'react'
import { Loader } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'

import Button from '@/components/button'
import { EditIcon, RemoveIcon } from '@/components/icons'

import { MediaService } from '@/services/media/media.service'

import { cn } from '@/utils'

import { User } from '@/types'

type AvatarUploadProps = HTMLProps<HTMLInputElement> &
  HTMLProps<HTMLImageElement> & {
    profile?: User
    wrapperClassName?: string
    onChangeUrl: (url: string) => void
  }

const AvatarUpload = ({
  wrapperClassName,
  alt,
  profile,
  onChangeUrl,
  ...props
}: AvatarUploadProps) => {
  const [src, setSrc] = useState<string | null>(null)

  const { mutate: uploadFile, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const url = await MediaService.getInstance().uploadFile(file)
      setSrc(url)
      onChangeUrl(url)
    },
  })

  useEffect(() => {
    setSrc(profile?.avatar ?? '')
  }, [profile?.avatar])

  return (
    <div
      className={cn(
        'relative flex items-center justify-center aspect-square rounded-3xl group overflow-hidden bg-neutral-50',
        wrapperClassName,
      )}
    >
      {!src && (
        <div className="flex flex-col items-center justify-center size-[120px]">
          <img src="/images/default-avatar.png" alt="" className="size-full" />
        </div>
      )}

      {src && (
        <img
          src={src}
          className="w-full h-full object-cover rounded-3xl"
          alt={alt}
          {...props}
        />
      )}

      <input
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer z-20"
        {...props}
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file) return
          uploadFile(file)
        }}
        disabled={isPending}
      />

      <div className="absolute inset-0 flex items-center justify-center bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        {isPending ? (
          <Loader className="text-neutral-100 w-6 h-6 animate-spin" />
        ) : src ? (
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setSrc(null)
              onChangeUrl('')
            }}
          >
            <RemoveIcon className="w-4 h-4 text-neutral-100" />
          </Button>
        ) : (
          <EditIcon className="w-6 h-6 text-neutral-25" />
        )}
      </div>
    </div>
  )
}

export default AvatarUpload
