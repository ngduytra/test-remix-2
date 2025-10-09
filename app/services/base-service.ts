import axios, { AxiosInstance } from 'axios'

import { LOCAL_STORAGE_KEY } from '@/constants'

export class BaseService {
  axios: AxiosInstance
  constructor(baseURL: string) {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)
        : null
    this.axios = axios.create({
      baseURL,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
  }

  updateAccessToken(accessToken?: string) {
    if (accessToken) {
      this.axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`
      return
    } else {
      this.axios.defaults.headers['Authorization'] = null
    }
  }
}
