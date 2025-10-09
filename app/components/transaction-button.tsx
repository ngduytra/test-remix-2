import { Chain } from 'thirdweb/chains'
import {
  useActiveAccount,
  useActiveWalletChain,
  useConnectModal,
  useSwitchActiveWalletChain,
} from 'thirdweb/react'

import Button from './button'

import { useConnectThirdweb } from '@/hooks/system/useConnectThirdweb'

import { supportChain } from '@/configs/chain.config'

type TransactionButtonProps = React.ComponentProps<typeof Button> & {
  chain?: Chain
}

const TransactionButton = ({ children, ...props }: TransactionButtonProps) => {
  const account = useActiveAccount()
  const activeChain = useActiveWalletChain()
  const { client, wallets, onConnect } = useConnectThirdweb()
  const switchChain = useSwitchActiveWalletChain()
  const { connect } = useConnectModal()
  const wrongChain = activeChain?.id !== supportChain.id

  const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!account) {
      const wallet = await connect({
        size: 'compact',
        client,
        wallets,
        chain: supportChain,
        chains: [supportChain],
        theme: 'light',
      })
      await onConnect(wallet)
      return
    }
    if (wrongChain) {
      switchChain(supportChain)
      return
    }
    props.onClick?.(e)
  }

  return (
    <Button {...props} onClick={onClick}>
      {account && wrongChain ? `Switch to ${supportChain.name}` : children}
    </Button>
  )
}

export default TransactionButton
