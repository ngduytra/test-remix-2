import { useEffect, useState } from 'react'
import { ClientOnly } from 'remix-utils/client-only'
import { useNavigate } from '@remix-run/react'
import { useActiveAccount } from 'thirdweb/react'

import ConnectButton from './connect-button'
import Avatar from './avatar'
import Menu from './menu'

import { useCheckCurrentPage } from '@/hooks/system/useCheckCurrentPage'
import { useUserByWallet } from '@/hooks/user/useUserByWallet'
import { usePrefetchAllNftsByOwner } from '@/hooks/base-scan/usePrefetchAllNftsByOwner'

import { cn } from '@/utils'
import { ROUTE } from '@/constants'

export function Header() {
  const navigate = useNavigate()
  const isCreateCollectionPath = useCheckCurrentPage(ROUTE.CREATE_COLLECTION)
  const [isScrolled, setIsScrolled] = useState(false)
  const activeAccount = useActiveAccount()
  const { data: userInfo } = useUserByWallet(activeAccount?.address)

  // Start background NFT fetching when user connects
  usePrefetchAllNftsByOwner(activeAccount?.address!)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'flex items-center justify-between w-full py-4 sm:py-5 px-10 sm:px-4',
        'fixed top-0 left-0 right-0 z-20 sm:z-[99999]',
        'transition-colors duration-500 ease-in-out',
        isScrolled &&
          ' border-b border-[rgba(3,3,3,0.12)] bg-white/80 backdrop-blur-md',
        isCreateCollectionPath && 'sm:hidden',
      )}
    >
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate(ROUTE.HOME)}
      >
        <img
          src="/dopamint-text-logo-dark.png"
          alt="logo"
          className="h-10 sm:h-[30px]"
        />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 sm:hidden lg:block">
        <Menu />
      </div>

      <div className="flex items-center gap-2">
        <ClientOnly>
          {() => (
            <ConnectButton
              className={isScrolled ? '!bg-neutral-50' : undefined}
            />
          )}
        </ClientOnly>

        {activeAccount ? (
          <button onClick={() => navigate(`/profile/${activeAccount.address}`)}>
            <Avatar
              src={userInfo?.avatar}
              alt="avatar"
              className="cursor-pointer bg-transparent hover:border-[1.5px] hover:border-primary"
            />
          </button>
        ) : null}
      </div>
    </header>
  )
}
