export type User = {
  _id: string
  username: string
  wallet: string
  createdAt: string
  updatedAt: string
  avatar?: string
  bio?: string
  xUsername?: string
  telegramUsername?: string
  farcasterUsername?: string
  website?: string
}

export type UpdateUserDto = {
  username?: string
  avatar?: string
  bio?: string
  xUsername?: string
  telegramUsername?: string
  farcasterUsername?: string
  website?: string
}
