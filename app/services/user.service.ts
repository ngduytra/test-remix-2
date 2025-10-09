import { LoginPayload } from 'thirdweb/auth'

import { BaseService } from './base-service'

import { UpdateUserDto, User } from '@/types'

export class UserService extends BaseService {
  static instance: UserService
  constructor() {
    super(import.meta.env.VITE_DOPAMINT_USER_API)
  }
  async getUserById(id: string) {
    const { data } = await this.axios.get<User>(`/users/${id}`)
    return data
  }

  async getUserByWallet(wallet: string) {
    const { data } = await this.axios.get<User>(`/users/by-wallet/${wallet}`)
    return data
  }

  async getSigningChallenge(address: string) {
    const { data } = await this.axios.get<LoginPayload>(
      `/auth/signing-challenge/${address}`,
    )
    return data
  }
  async login(payload: LoginPayload, signature: string) {
    const { data } = await this.axios.post<{ jwt: string }>('/auth/login', {
      payload,
      signature,
    })
    return data
  }

  async refreshToken() {
    const { data } = await this.axios.post<{ jwt: string }>('/auth/refresh')
    return data
  }

  async updateProfile(payload: UpdateUserDto) {
    const { data } = await this.axios.put<User>(`/users/my-profile`, payload)
    return data
  }

  static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }
}
