import { useState } from 'react'

import { Checkbox } from 'radix-ui'
import { CheckIcon, FilterIcon } from 'lucide-react'

import { CloseIcon } from './icons'
import Button from './button'
import Tooltip from './tooltip'

import { TransactionFilter } from '@/constants'
import { cn } from '@/utils'

function TransactionsFilter({
  filters,
  setFilters,
}: {
  filters: TransactionFilter[]
  setFilters: React.Dispatch<React.SetStateAction<TransactionFilter[]>>
}) {
  const [openFilter, setOpenFilter] = useState(false)

  const handleItemChange = (item: TransactionFilter) => (checked: boolean) => {
    if (checked) {
      setFilters((prev) => [...prev, item])
    } else {
      setFilters((prev) => prev.filter((i) => i !== item))
    }
  }

  return (
    <div className="flex flex-row gap-x-6 sm:flex-col sm:gap-y-3 ">
      <div className="flex flex-row gap-x-4 flex-auto">
        {filters.map((filter) => (
          <div
            className="text-sm font-medium text-neutral-900 cursor-pointer px-4 py-[10px] flex flex-row gap-x-[6px] justify-center items-center bg-neutral-0 rounded-[1024px]"
            key={filter}
          >
            <div className="h-[18px]">{filter}</div>
            <div
              onClick={() =>
                setFilters((prev) => prev.filter((i) => i !== filter))
              }
            >
              <CloseIcon className="text-primary" width={20} height={20} />
            </div>
          </div>
        ))}
      </div>

      <div className="sm:order-first sm:flex sm:justify-end">
        <Tooltip
          content={
            <div>
              {Object.entries(TransactionFilter).map(([key, value]) => (
                <div key={key} className="flex flex-row p-4">
                  <Checkbox.Root
                    checked={filters.includes(value)}
                    onCheckedChange={handleItemChange(value)}
                    id={value}
                    className={cn(
                      'w-5 h-5 rounded-[4px] flex items-center justify-center ',
                      filters.includes(value)
                        ? 'bg-primary'
                        : 'border-[1.6px] border-solid border-dark/[0.12]',
                    )}
                  >
                    <Checkbox.Indicator>
                      <CheckIcon className="text-white w-4 h-4" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label htmlFor={value} style={{ marginLeft: 10 }}>
                    {value}
                  </label>
                </div>
              ))}
            </div>
          }
          open={openFilter}
          onPointerDownOutside={() => setOpenFilter(false)}
          asChildArrow={true}
        >
          <Button
            variant="primary"
            size="sm"
            onClick={() => setOpenFilter(true)}
          >
            <FilterIcon />
            Filter
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}

export default TransactionsFilter
