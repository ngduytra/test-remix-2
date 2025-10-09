import { createThirdwebClient } from 'thirdweb'
import { inAppWallet } from 'thirdweb/wallets'

export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
})

export const wallets = [
  inAppWallet({
    // available auth methods
    auth: {
      options: [
        'email',
        'google',
        'discord',
        'github',
        'wallet',
        'x',
        'telegram',
      ],
    },

    // gasless, keep it for now
    // executionMode: {
    //   mode: 'EIP7702',
    //   sponsorGas: true,
    // },
  }),
]
