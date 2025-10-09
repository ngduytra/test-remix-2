import { JWTPayload as ThirdwebJWTPayload } from 'thirdweb/utils'

export type JwtPayload = {
  ctx: {
    uid: string
    wallet: string
  }
} & ThirdwebJWTPayload
