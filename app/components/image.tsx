import {
  ImgHTMLAttributes,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react'

import { CircleWarningIcon } from './icons'

import { cn } from '@/utils'

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  imageClassName?: string
  imageStyle?: React.CSSProperties
  initialHeight?: string
  initialWidth?: string
  children?: ReactNode
  error?: string | ReactNode
  errorClassName?: string
  forceError?: boolean
}

const TIME_OUT = 30_000 // 30 seconds

const Image = ({
  src,
  alt,
  className,
  imageClassName,
  imageStyle,
  initialHeight,
  initialWidth,
  children,
  error,
  errorClassName,
  forceError,
  ...props
}: ImageProps) => {
  const imageRef = useRef<HTMLImageElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setHasError(true)
    }, TIME_OUT)

    if (src) {
      setIsLoading(true)
      setHasError(false)
      clearTimeout(timeoutRef.current)

      if (imageRef.current?.complete) setIsLoading(false)
    }

    return () => clearTimeout(timeoutRef.current)
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
    clearTimeout(timeoutRef.current)
  }

  const handleError = () => {
    clearTimeout(timeoutRef.current)
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError || forceError) {
    return (
      <div
        className={cn(
          'size-full gap-1 flex items-center justify-center',
          'bg-[radial-gradient(#E5320F,#EA992488)]',
          className,
          errorClassName,
        )}
      >
        {typeof error === 'string' || typeof error === 'undefined' ? (
          <>
            <CircleWarningIcon className="text-neutral-0 mb-[1px]" />
            <span className="text-neutral-25 text-[0.75rem]">
              {error ?? 'Image failed to display'}
            </span>
          </>
        ) : (
          error
        )}
      </div>
    )
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{
        height: isLoading && initialHeight ? initialHeight : undefined,
        width: isLoading && initialWidth ? initialWidth : undefined,
      }}
    >
      {isLoading && (
        <>
          <div className="absolute inset-0 bg-[url('/images/gradient-bg.png')] bg-cover bg-center bg-no-repeat" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-gray-600/20 transform -skew-x-12 animate-shimmer" />
        </>
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          'object-cover w-full h-full',
          isLoading ? 'opacity-0' : 'opacity-100',
          imageClassName,
        )}
        onLoad={handleLoad}
        onError={handleError}
        ref={imageRef}
        style={imageStyle}
        loading="lazy"
        {...props}
      />
      {children}
    </div>
  )
}

export default Image
