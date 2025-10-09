import { base, baseSepolia, Chain } from 'thirdweb/chains'

import env, { type Env } from './env.config'

const supportedChain: Record<Env, Chain> = {
  development: baseSepolia,
  staging: baseSepolia,
  production: base,
}

export const supportChain = supportedChain[env]
