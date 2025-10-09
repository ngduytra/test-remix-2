import { ConnectButton as ThirdwebConnectButton } from 'thirdweb/react'

import { EthTokenIcon } from './icons'

import { useConnectThirdweb } from '@/hooks/system/useConnectThirdweb'

import { client, wallets } from '@/configs/thirdweb.config'
import { supportChain } from '@/configs/chain.config'
import { formatToken } from '@/utils/number.util'
import { cn } from '@/utils'

type ConnectButtonProps = {
  className?: string
}

const ConnectButton = ({ className }: ConnectButtonProps) => {
  const { onConnect, onDisconnect, balance } = useConnectThirdweb()

  return (
    <ThirdwebConnectButton
      client={client}
      wallets={wallets}
      chains={[supportChain]}
      chain={supportChain}
      connectButton={{
        label: 'Login',
        className: cn(
          '!bg-transparent !px-5 !py-3 !rounded-full !backdrop-blur-[50px] !text-neutral-900 !min-w-[100px] min-h-8 !h-10 !flex !items-center',
          'hover:!bg-[rgb(40,40,40)]/10 sm:!text-sm sm:!h-fit sm:w-fit',
          className,
        ),
        style: {
          border: '1px solid rgba(248, 248, 248, 0.12)',
          backgroundBlendMode: 'luminosity',
        },
      }}
      theme="light"
      detailsButton={{
        render: () => {
          return (
            <div className="flex gap-x-3 items-center cursor-pointer">
              <div className="py-2 rounded-full w-[125px] sm:w-[110px] border-[0.8px] border-neutral-900/[0.12] flex justify-center items-center gap-x-2">
                <span className="text-sm font-medium text-neutral-900">
                  {formatToken(balance?.value ?? 0n)}
                </span>
                <EthTokenIcon className="mb-[2px] text-neutral-700" />
              </div>
            </div>
          )
        },
      }}
      detailsModal={{
        hideSwitchWallet: true,
      }}
      onConnect={onConnect}
      onDisconnect={onDisconnect}
    />
  )
}

export default ConnectButton
