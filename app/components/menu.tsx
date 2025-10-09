import { useContext } from 'react'
import { useLocation, useNavigate } from '@remix-run/react'

import Button from './button'
import { ExploreIcon, SearchIcon, ThreeStarsIcon } from './icons'

import { ModalContext } from '@/providers/modal.provider'

import { cn } from '@/utils'

import { MODAL_NAME, ROUTE } from '@/constants'

const Menu = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isExplore = location.pathname === '/'
  const { openModal } = useContext(ModalContext)

  return (
    <div className="flex items-center gap-x-5 relative">
      <Button
        variant="secondary"
        className={cn(
          'h-9 space-x-[6px] border-0',
          isExplore ? 'border-2 border-primary' : '',
        )}
        onClick={() => navigate(ROUTE.HOME)}
      >
        <ExploreIcon className="text-neutral-700" />
        <span className="text-neutral-700 text-[15px] font-normal">
          Explore
        </span>
      </Button>

      <Button
        className={cn(
          'flex items-center justify-center gap-x-[6px] px-5 py-3 rounded-full h-11',
        )}
        variant="special"
        onClick={() => navigate('/create-collection')}
      >
        <ThreeStarsIcon className="text-neutral-25" />
        <span className="text-sm font-medium text-neutral-25">Create</span>
      </Button>

      <Button
        variant="secondary"
        className="h-9 gap-x-[6px] border-none"
        onClick={() => openModal(MODAL_NAME.SEARCH, {})}
      >
        <SearchIcon className="text-neutral-700" />
        <span className="text-neutral-700 text-[15px] font-normal">Search</span>
      </Button>
    </div>
  )
}

export default Menu
