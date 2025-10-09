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
  activeTab: string
  setActiveTab: (tab: string) => void
}

const NftDetailsTabs = ({
  tabs,
  rootClassName,
  listClassName,
  triggerClassName,
  contentClassName,
  activeTab,
  setActiveTab,
}: TabsProps) => (
  <div
    className={cn(
      'bg-neutral-0 xl:rounded-3xl rounded-none overflow-hidden xl:h-[845px] h-full flex flex-col',
      rootClassName,
    )}
  >
    <TabsPrimitive.Root
      className="flex flex-col h-full"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsPrimitive.List
        className={cn(
          'flex justify-stretch items-stretch flex-shrink-0 border-b',
          listClassName,
        )}
        aria-label="Manage your account"
      >
        {tabs.map((tab, index) => (
          <TabsPrimitive.Trigger
            className={cn(
              'px-4 py-2.5 h-12 flex items-center justify-center gap-1.5 transition-all duration-200',
              'text-base font-medium flex-1 relative',
              'data-[state=inactive]:text-neutral-900 data-[state=inactive]:bg-transparent data-[state=inactive]:opacity-40',
              'data-[state=active]:text-neutral-0 data-[state=active]:bg-primary',
              'data-[state=inactive]:hover:text-primary data-[state=inactive]:hover:opacity-100',
              // First tab gets left rounded corner when active
              index === 0 &&
                'xl:data-[state=active]:rounded-tl-[24px] data-[state=active]:rounded-none',
              // Last tab gets right rounded corner when active
              index === tabs.length - 1 &&
                'xl:data-[state=active]:rounded-tr-[24px] data-[state=active]:rounded-none',
              tab.disabled &&
                'opacity-50 cursor-not-allowed pointer-events-none',
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
          className={cn('flex-1 min-h-0 h-full bg-neutral-0', contentClassName)}
          value={tab.value}
          key={tab.value}
        >
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  </div>
)

export default NftDetailsTabs
