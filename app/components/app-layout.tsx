import { ClientOnly } from 'remix-utils/client-only'
import { PropsWithChildren } from 'react'

import { Header } from './header'
import MenuMobile from './menu-mobile'

import { useCheckCurrentPage } from '@/hooks/system/useCheckCurrentPage'

import { ROUTE } from '@/constants'
import { cn } from '@/utils'

const AppLayout = ({ children }: PropsWithChildren) => {
  const isCreateCollectionPath = useCheckCurrentPage(ROUTE.CREATE_COLLECTION)

  return (
    <div
      className={cn(
        '2xl:max-w-[1840px] w-full mx-auto px-4 pt-[72px] xl:px-10 2xl:px-0',
        isCreateCollectionPath && 'sm:pt-0',
      )}
    >
      <Header />

      {children}
      <ClientOnly>
        {() => (
          <>
            <MenuMobile className="hidden sm:block fixed bottom-0 left-0 right-0 z-10 w-full" />
          </>
        )}
      </ClientOnly>
    </div>
  )
}

export default AppLayout
