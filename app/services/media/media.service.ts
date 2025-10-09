import { BaseService } from '../base-service'

export class MediaService extends BaseService {
  static instance: MediaService
  constructor() {
    super(import.meta.env.VITE_DOPAMINT_MEDIA_API)
  }

  async uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await this.axios.post<string>('/media/general', formData)
    return data
  }

  static getInstance() {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService()
    }
    return MediaService.instance
  }
}
