import GlobalNftModal from '@/components/global-nft-modal'
import SearchModal from '@/components/search-modal'

import { ModalProvider } from './modal.provider'

export default function GlobalModalProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ModalProvider
      modals={{
        search: <SearchModal />,
      }}
    >
      {children}
      <GlobalNftModal />
    </ModalProvider>
  )
}
