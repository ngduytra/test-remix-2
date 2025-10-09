import { createContext, Fragment, useCallback, useState } from 'react'

type Data = object | string | number | boolean

type ModalContextType = {
  modalData: Record<string, Data>
  setModalData: (data: Record<string, Data>) => void
  closeModal: (modalKey: string) => void
  openModal: <T extends Data>(modalKey: string, data: T) => void
}

export const ModalContext = createContext<ModalContextType>({
  modalData: {},
  setModalData: () => {},
  closeModal: () => {},
  openModal: () => {},
})

type ModalProviderProps = {
  children: React.ReactNode
  modals: Record<string, React.ReactNode>
}
export const ModalProvider = ({ children, modals }: ModalProviderProps) => {
  const [modalData, setModalData] = useState<Record<string, Data>>(
    Object.keys(modals).reduce((acc, key) => {
      acc[key] = false
      return acc
    }, {} as Record<string, Data>),
  )

  const closeModal = useCallback((key: string) => {
    setModalData((prev) => ({ ...prev, [key]: false }))
  }, [])

  const openModal = useCallback((key: string, data: Data) => {
    setModalData((prev) => ({ ...prev, [key]: data }))
  }, [])


  return (
    <ModalContext.Provider
      value={{ modalData, setModalData, closeModal, openModal }}
    >
      {children}
      {Object.entries(modals).map(([key, Component]) => {
        if (modalData[key]) {
          return <Fragment key={key}>{Component}</Fragment>
        }
        return null
      })}
    </ModalContext.Provider>
  )
}
