import * as React from 'react'
import { Select as SelectPrimitive } from 'radix-ui'
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons'

import { cn } from '@/utils'

type SelectProps = {
  rootProps?: SelectPrimitive.SelectProps
  placeholder?: string
  showScrollButtons?: boolean
  triggerClassName?: string
  contentClassName?: string
  itemClassName?: string
} & (
  | {
      options: {
        label: string
        value: string
      }[]
      groups?: never
    }
  | {
      options?: never
      groups: {
        label: string
        options: {
          label: string
          value: string
        }[]
      }[]
    }
)

const Select = ({
  placeholder,
  options = [],
  groups = [],
  showScrollButtons = false,
  triggerClassName,
  contentClassName,
  itemClassName,
  rootProps,
}: SelectProps) => (
  <SelectPrimitive.Root {...rootProps}>
    <SelectPrimitive.Trigger
      className={cn(
        'flex justify-between items-center px-5 py-3 border-[1.5px] border-dark/[0.12] text-neutral-900 hover:bg-light/[0.12] rounded-full outline-none',
        rootProps?.disabled &&
          'bg-light/[0.12] cursor-not-allowed text-neutral-900/50',
        triggerClassName,
      )}
    >
      <SelectPrimitive.Value placeholder={placeholder} />
      <SelectPrimitive.Icon className="SelectIcon">
        <ChevronDownIcon />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          'p-3 bg-light rounded-3xl border border-light/[0.12] w-full',
          'w-[var(--radix-select-trigger-width)]',
          contentClassName,
        )}
        position="popper"
        sideOffset={10}
      >
        {showScrollButtons && (
          <SelectPrimitive.ScrollUpButton className="SelectScrollButton">
            <ChevronUpIcon />
          </SelectPrimitive.ScrollUpButton>
        )}

        <SelectPrimitive.Viewport className="space-y-[6px]">
          {groups.map((group, index) => (
            <React.Fragment key={group.label}>
              <SelectPrimitive.Group>
                <SelectPrimitive.Label className="SelectLabel">
                  {group.label}
                </SelectPrimitive.Label>
                {group.options.map((option) => (
                  <SelectItem
                    value={option.value}
                    className={cn(
                      'px-3 py-4 text-neutral-900 text-sm rounded-2xl border border-transparent cursor-pointer transition-all duration-200',
                      'hover:bg-light/[0.12] hover:text-neutral-800 hover:border-neutral-900',
                      itemClassName,
                    )}
                    key={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectPrimitive.Group>
              {index < groups.length - 1 && (
                <SelectPrimitive.Separator className="SelectSeparator" />
              )}
            </React.Fragment>
          ))}

          {options.map((option) => (
            <SelectItem
              value={option.value}
              key={option.value}
              className={cn(
                'px-3 py-4 text-neutral-900 text-sm rounded-2xl border border-transparent cursor-pointer transition-all duration-200 flex items-center justify-between',
                'hover:bg-light/[0.12] hover:text-neutral-800 hover:border-neutral-900',
                itemClassName,
              )}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectPrimitive.Viewport>

        {showScrollButtons && (
          <SelectPrimitive.ScrollDownButton className="SelectScrollButton">
            <ChevronDownIcon />
          </SelectPrimitive.ScrollDownButton>
        )}
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  </SelectPrimitive.Root>
)

const SelectItem = React.forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectItemProps
>(function SelectItemComponent(
  { children, className, ...props },
  forwardedRef,
) {
  return (
    <SelectPrimitive.Item
      className={cn('outline-none', className)}
      {...props}
      ref={forwardedRef}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator>
        <CheckIcon />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
})

export default Select
