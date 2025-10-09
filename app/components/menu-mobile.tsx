import { useContext } from 'react'
import { useLocation, useNavigate } from '@remix-run/react'

import Button from './button'
import { ExploreIcon, SearchIcon, ThreeStarsIcon } from './icons'

import { ModalContext } from '@/providers/modal.provider'

import { cn } from '@/utils'

import { MODAL_NAME, ROUTE } from '@/constants'

interface MenuMobileProps {
  className?: string
}

const modalName = MODAL_NAME.SEARCH

const MenuMobile = ({ className }: MenuMobileProps) => {
  const { openModal } = useContext(ModalContext)
  const navigate = useNavigate()
  const location = useLocation()
  const isExplore = location.pathname === '/'
  const isCreate = location.pathname === '/create-collection'

  if (isCreate) return null

  return (
    <div
      className={cn(
        className,
        'transition-transform duration-300',
        'px-3 py-3 bg-light/[0.8] backdrop-blur-[10px]',
        'opacity-100 translate-y-0 pointer-events-auto',
      )}
    >
      <div
        className={cn('rounded-full flex items-center gap-2 mx-auto max-w-fit')}
      >
        <Button
          className={cn(
            'w-[115px] !px-5 py-3 rounded-full bg-transparent border-0 hover:bg-[#282828]/70',
            isExplore ? 'bg-neutral-0 border-2 border-primary' : '',
          )}
          onClick={() => navigate(ROUTE.HOME)}
          size="sm"
        >
          <ExploreIcon className="size-5 text-neutral-900" />
        </Button>
        <Button
          className={cn('w-[115px] px-5 py-3 rounded-full')}
          variant="special"
          onClick={() => navigate(ROUTE.CREATE_COLLECTION)}
          size="sm"
        >
          <ThreeStarsIcon className="text-white size-6" />
        </Button>
        <Button
          className={
            'w-[115px] !px-5 py-3 rounded-full bg-transparent border-0 hover:bg-neutral-0 sm:px-4'
          }
          onClick={() => openModal(modalName, {})}
          size="sm"
        >
          <SearchIcon className="size-5 text-neutral-900" />
        </Button>
      </div>
    </div>
  )
}

export default MenuMobile
