import { Tabs as TabsPrimitive } from 'radix-ui'

import { cn } from '@/utils'

type TabsProps = {
  tabs: {
    label: string | React.ReactNode
    value: string
    content: React.ReactNode
    disabled?: boolean
  }[]
  rootClassName?: string
  listClassName?: string
  triggerClassName?: string
  contentClassName?: string
  activeTab?: string
  setActiveTab?: (tab: string) => void
}

const Tabs = ({
  activeTab,
  setActiveTab,
  tabs,
  rootClassName,
  listClassName,
  triggerClassName,
  contentClassName,
}: TabsProps) => (
  <TabsPrimitive.Root
    className={cn(rootClassName)}
    defaultValue={tabs[0].value}
    value={activeTab}
    onValueChange={setActiveTab}
  >
    <TabsPrimitive.List
      className={cn('flex justify-center items-center gap-1', listClassName)}
      aria-label="Manage your account"
    >
      {tabs.map((tab) => (
        <TabsPrimitive.Trigger
          className={cn(
            'px-5 py-3 rounded-full shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] h-[42px] flex items-center justify-center',
            'backdrop-blur-[50px] border transition-all duration-200',
            'data-[state=active]:bg-neutral-50 data-[state=active]:hover:bg-neutral-100',
            'data-[state=inactive]:bg-transparent data-[state=inactive]:border-dark/[0.12]',
            'text-sm flex-1 text-neutral-900',
            tab.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
            triggerClassName,
          )}
          value={tab.value}
          key={tab.value}
          disabled={tab.disabled}
        >
          {tab.label}
        </TabsPrimitive.Trigger>
      ))}
    </TabsPrimitive.List>
    {tabs.map((tab) => (
      <TabsPrimitive.Content
        className={cn(contentClassName)}
        value={tab.value}
        key={tab.value}
      >
        {tab.content}
      </TabsPrimitive.Content>
    ))}
  </TabsPrimitive.Root>
)

export default Tabs
