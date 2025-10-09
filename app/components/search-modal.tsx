import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from '@remix-run/react'

import {
  CloseIcon,
  CollectionIcon,
  CreatorIcon,
  LoadingIcon,
  SearchIcon,
} from '@/components/icons'
import Button from './button'
import Dialog from './dialog'

import { ModalContext } from '@/providers/modal.provider'

import { useSearchCollections } from '@/hooks/nft'
import { useDebounced } from '@/hooks/utils'

import { cn } from '@/utils'

import { MODAL_NAME } from '@/constants'

type ResultItem = {
  id: number
  type: 'collection' | 'creator'
  name: string
  contractAddress?: string
}

const modalName = MODAL_NAME.SEARCH

const SearchModal = () => {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounced(searchTerm, 300)

  const { data: collectionsData, isLoading } = useSearchCollections(
    debouncedSearchTerm,
    debouncedSearchTerm.length >= 1,
  )

  const { modalData, closeModal } = useContext(ModalContext)
  const open = Boolean(modalData[modalName])

  const result: ResultItem[] =
    collectionsData?.data?.map((collection) => ({
      id: parseInt(collection.collectionId || '0'),
      type: 'collection' as const,
      name: collection.name || '',
      contractAddress: collection.contractAddress || '',
    })) || []

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    } else {
      // Clear search when panel closes for fresh start next time
      setSearchTerm('')
    }
  }, [open])

  const handleItemClick = (item: ResultItem) => {
    if (item.type === 'collection' && item.contractAddress) {
      navigate(`/collections/${item.contractAddress}`)
      closeModal(modalName)
    }
  }

  return (
    <Dialog
      name={modalName}
      onOpenChange={() => closeModal(modalName)}
      titleClassName="!hidden"
      closeClassName="!hidden"
      overlayClassName="bg-black/40"
      contentClassName={cn(
        'p-0 flex w-full max-w-[700px] z-50 rounded-[32px] fixed top-20',
        'border border-light/[0.12] bg-neutral-0/90 backdrop-blur-xl',
        'sm:w-[92%] sm:h-[600px] sm:top-[88px] sm:!left-1/2 sm:!-translate-x-1/2',
      )}
      onPointerDownOutside={() => closeModal(modalName)}
    >
      <div className="size-full flex flex-col gap-y-3 p-3 rounded-[32px]">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'relative w-full h-12 flex items-center justify-between gap-x-3 bg-light/[0.08] px-5 py-3',
              'border-[1.5px] border-neutral-900/[0.12] rounded-[48px]',
              'hover:border-primary hover:border-2',
            )}
          >
            <SearchIcon className="sm:size-4 text-neutral-800 rotate-90" />
            <input
              type="text"
              placeholder="Search by collection"
              className={cn(
                'bg-transparent outline-none w-full text-neutral-900 caret-primary',
                'placeholder:pl-[6px] placeholder:relative placeholder:top-[2px]',
              )}
              ref={inputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isLoading && (
              <div className="absolute right-5 flex items-center justify-center">
                <LoadingIcon className="size-5 animate-spin" />
              </div>
            )}
          </div>
          <Button
            onClick={() => closeModal(modalName)}
            className="rounded-full bg-neutral-50 border-none hover:bg-neutral-100 border-[1.5px] size-12 p-3"
          >
            <CloseIcon className="text-[#7B7B7B]" />
          </Button>
        </div>

        <div
          className={cn(
            'flex flex-col gap-y-3 overflow-y-auto hide-scrollbar',
            'h-[316px] sm:h-full',
            !result.length && 'justify-center items-center',
          )}
        >
          {result.length ? (
            result.map((item) => (
              <SearchResultItem
                key={item.id}
                type={item.type}
                name={item.name}
                keywords={searchTerm ? [searchTerm] : []}
                onClick={() => handleItemClick(item)}
              />
            ))
          ) : searchTerm.length < 1 ? null : isLoading ? (
            <>
              <SearchIcon className="size-6 text-neutral-600" />
              <span className="text-neutral-600">Searching...</span>
            </>
          ) : (
            <>
              <SearchIcon className="size-6 text-neutral-600" />
              <span className="text-neutral-600">No result found.</span>
            </>
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default SearchModal

type SearchResultItemProps = {
  type: 'collection' | 'creator'
  name: string
  keywords: string[]
  onClick?: () => void
}
const SearchResultItem = ({
  type,
  name,
  keywords,
  onClick,
}: SearchResultItemProps) => {
  const [displayName, setDisplayName] = useState(name)

  useEffect(() => {
    let processedName = name
    keywords.forEach((keyword) => {
      processedName = processedName.replace(
        new RegExp(`(${keyword})`, 'gi'),
        `<span class="text-primary">$1</span>`,
      )
    })
    setDisplayName(processedName)
  }, [name, keywords])

  return (
    <div
      className="w-full flex gap-x-3 items-center py-3 px-2 rounded-lg hover:bg-neutral-0 cursor-pointer transition-colors"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      <div className="size-8 p-[6px] rounded-full bg-neutral-900/[0.12]">
        {type === 'collection' ? (
          <CollectionIcon className="text-neutral-900" />
        ) : (
          <CreatorIcon className="text-neutral-900" />
        )}
      </div>
      <div className="text-sm text-neutral-900">
        <span dangerouslySetInnerHTML={{ __html: displayName }} />
      </div>
    </div>
  )
}
