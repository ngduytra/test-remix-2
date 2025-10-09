import * as RadixTooltip from '@radix-ui/react-tooltip'

import { cn } from '@/utils'

type Props = {
  content: string | React.ReactNode
  children: React.ReactNode
  contentClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onPointerDownOutside?: () => void
  asChildArrow?: boolean
}

const Tooltip = (props: Props) => {
  const {
    children,
    content,
    contentClassName,
    open,
    onOpenChange,
    onPointerDownOutside,
    asChildArrow,
  } = props

  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root open={open} onOpenChange={onOpenChange}>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            className={cn(
              'z-[22] bg-neutral-0/90 backdrop-blur-lg rounded-[12px] p-3 max-w-[300px] shadow-md m-2',
              contentClassName,
            )}
            onPointerDownOutside={onPointerDownOutside}
          >
            {content}
            <RadixTooltip.Arrow asChild={asChildArrow} />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}

export default Tooltip
