import { cn } from '@/utils'

type AvatarProps = {
  src?: string
  alt: string
  className?: string
  imageClassName?: string
}

export default function Avatar({
  src,
  alt,
  className,
  imageClassName,
}: AvatarProps) {
  const hasImage = !!src?.trim()

  return (
    <div
      className={cn(
        'size-10 rounded-full overflow-hidden bg-gray-700 border border-white/[0.12] flex items-center justify-center text-white text-sm font-semibold',
        className,
      )}
    >
      {!hasImage && (
        <div className="relative flex flex-col items-center justify-center">
          <img
            src="/images/default-avatar.png"
            alt="default avatar"
            className={cn('size-full object-contain', imageClassName)}
          />
        </div>
      )}

      {hasImage && (
        <img
          src={src}
          className={cn('w-full h-full object-cover', imageClassName)}
          alt={alt}
        />
      )}
    </div>
  )
}
