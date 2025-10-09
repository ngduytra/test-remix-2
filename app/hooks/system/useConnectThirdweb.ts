import { useCallback, useEffect } from 'react'
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useActiveWalletConnectionStatus,
  useDisconnect,
  useWalletBalance,
} from 'thirdweb/react'
import { jwtDecode } from 'jwt-decode'
import { Wallet } from 'thirdweb/wallets'
import { signLoginPayload } from 'thirdweb/auth'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'

import { UserService } from '@/services/user.service'
import { AIService } from '@/services/ai/ai.service'
import { OrchestratorService } from '@/services/orchestrator/orchestrator.service'
import { NFTService } from '@/services/nft/nft.service'
import { MediaService } from '@/services/media/media.service'
import { FinanceService } from '@/services/finance/finance.service'

import { useTokenBalancesStore } from '@/stores/useTokenBalanceStore'

import { client, wallets } from '@/configs/thirdweb.config'
import { JwtPayload } from '@/types'
import { LOCAL_STORAGE_KEY } from '@/constants'

type UseConnectThirdwebProps =
  | {
      onConnectCallback?: (JwtPayload: JwtPayload) => void
      onDisconnectCallback?: () => void
    }
  | undefined

const TOKEN_REFRESH_THRESHOLD = 1 // day

export const useConnectThirdweb = ({
  onConnectCallback,
  onDisconnectCallback,
}: UseConnectThirdwebProps = {}) => {
  const { disconnect } = useDisconnect()
  const activeAccount = useActiveAccount()
  const activeChain = useActiveWalletChain()
  const activeWallet = useActiveWallet()
  const { data: balance } = useWalletBalance({
    client,
    address: activeAccount?.address,
    chain: activeChain,
  })

  const status = useActiveWalletConnectionStatus()

  useEffect(() => {
    if (status === 'disconnected') {
      localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken)
    }
  }, [status])

  const updateAccessToken = useCallback((jwt?: string) => {
    UserService.getInstance().updateAccessToken(jwt)
    AIService.getInstance().updateAccessToken(jwt)
    OrchestratorService.getInstance().updateAccessToken(jwt)
    NFTService.getInstance().updateAccessToken(jwt)
    MediaService.getInstance().updateAccessToken(jwt)
    FinanceService.getInstance().updateAccessToken(jwt)
  }, [])

  const clearAccessToken = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken)
    updateAccessToken()
  }, [updateAccessToken])

  const onConnectMutation = useMutation({
    mutationFn: async (wallet: Wallet) => {
      const account = wallet.getAccount()
      if (!account) return wallet

      let jwt = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)
      const jwtExp = jwt ? jwtDecode<JwtPayload>(jwt).exp : null

      // if the token is expired or not exist, then login to get a new one
      if (!jwt || (jwtExp && dayjs.unix(jwtExp).isBefore(dayjs()))) {
        const challenge = await UserService.getInstance().getSigningChallenge(
          account.address,
        )
        const { payload, signature } = await signLoginPayload({
          payload: challenge,
          account,
        })
        const res = await UserService.getInstance().login(payload, signature)

        jwt = res.jwt
      }

      // if the token expires in less than 1 day, then exchange it for a new one
      let decoded = jwtDecode<JwtPayload>(jwt)
      if (
        decoded.exp &&
        dayjs
          .unix(decoded.exp)
          .subtract(TOKEN_REFRESH_THRESHOLD, 'days')
          .isBefore(dayjs())
      ) {
        UserService.getInstance().updateAccessToken(jwt)
        const res = await UserService.getInstance().refreshToken()
        jwt = res.jwt
        decoded = jwtDecode<JwtPayload>(jwt)
      }

      localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, jwt)
      updateAccessToken(jwt)
      onConnectCallback?.(decoded)

      return wallet
    },
    onError: () => {
      if (activeWallet) {
        disconnect(activeWallet)
      }
      clearAccessToken()
    },
  })

  const onDisconnect = useCallback(() => {
    useTokenBalancesStore.getState().clearBalances()
    clearAccessToken()
    onDisconnectCallback?.()
  }, [onDisconnectCallback, clearAccessToken])

  return {
    client,
    wallets,
    onConnect: onConnectMutation.mutateAsync,
    onDisconnect,
    activeAccount,
    activeChain,
    activeWallet,
    balance,
    status,
  }
}
