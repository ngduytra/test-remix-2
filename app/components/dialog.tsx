import { Dialog as DialogPrimitive } from 'radix-ui'
import { Cross2Icon } from '@radix-ui/react-icons'

import Button from './button'

import { useModal } from '@/hooks/system/useModal'

import { cn } from '@/utils'

type DialogProps = {
  name?: string
  onOpenChange?: (open: boolean) => void
  onPointerDownOutside?: (event: any) => void
  open?: boolean
  trigger?: React.ReactNode
  children: React.ReactNode
  title?: string
  contentClassName?: string
  titleClassName?: string
  overlayClassName?: string
  closeClassName?: string
  closeButton?: boolean
  closable?: boolean
  style?: React.CSSProperties
}

const Dialog = ({
  name,
  trigger,
  children,
  contentClassName,
  title,
  titleClassName,
  overlayClassName,
  closeClassName,
  onPointerDownOutside,
  onOpenChange,
  closeButton = true,
  closable = true,
  style,
}: DialogProps) => {
  const { modalData } = useModal()

  const isControlledByProvider = name && name.length > 0

  const Root = (
    <DialogPrimitive.Root
      open={isControlledByProvider ? !!modalData[name as string] : undefined}
      onOpenChange={onOpenChange}
    >
      {trigger ? (
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      ) : null}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn('bg-black/50 fixed inset-0 z-[21]', overlayClassName)}
        />
        <div className="fixed inset-0 flex justify-center items-center z-[21]">
          <DialogPrimitive.Content
            className={cn(
              'rounded-2xl p-0 min-w-[300px] min-h-[300px] relative animate-zoom-appear sm:animate-move-up',
              'bg-neutral-0 shadow-[0px_0px_16px_0px_rgba(248,248,248,0.06)] border border-light/[0.12]',
              'sm:top-[77px] sm:left-0 sm:right-0 sm:bottom-0 sm:translate-x-0 sm:translate-y-0 sm:max-h-[calc(100vh-78px)] sm:overflow-y-auto',
              contentClassName,
            )}
            onPointerDownOutside={(e) => {
              e.preventDefault() // Fix close multiple dialog
              onPointerDownOutside?.(e)
            }}
            style={style}
          >
            <DialogPrimitive.Title
              className={cn(
                '!text-[28px] font-bold text-neutral-900',
                titleClassName,
              )}
            >
              {title}
            </DialogPrimitive.Title>
            {children}
            {closeButton && (
              <DialogPrimitive.Close asChild>
                <Button
                  variant="neutral"
                  size="sm"
                  className={cn(
                    'p-3 size-10 absolute top-3 right-3 sm:p-1',
                    closeClassName,
                  )}
                  disabled={!closable}
                >
                  <Cross2Icon />
                </Button>
              </DialogPrimitive.Close>
            )}
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )

  return Root
}

export default Dialog
