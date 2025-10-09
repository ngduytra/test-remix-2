import { twMerge } from 'tailwind-merge'
//eslint-disable-next-line import/no-named-as-default
import clsx, { ClassValue } from 'clsx'

import { randomInt } from './number.util'

import { Social, SocialType } from '@/types'
import { DEFAULT_IMAGE_MODEL, IMAGE_MODEL_LABEL, ImageModel } from '@/constants'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const pause = (s: number) =>
  new Promise((resolve) => setTimeout(resolve, s * 1000))

export const randomImage = (width: number, height: number, index?: number) => {
  return `https://picsum.photos/${width}/${height}?random=${
    index ?? randomInt()
  }`
}

export const downloadFile = async (url: string, filename: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`)
  }
  const blob = await response.blob()
  const blobUrl = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none' // Ẩn thẻ a đi cho đẹp
  a.href = blobUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(blobUrl)
}

export const getShareUrl = (content: string, social: Social) => {
  switch (social) {
    case 'twitter':
      return 'https://twitter.com/intent/tweet?text=' + content
    default:
      return ''
  }
}

export const buildSocialLink = (type: SocialType, username?: string) => {
  if (!username) return null
  switch (type) {
    case SocialType.X:
      return `https://x.com/${username}`
    case SocialType.Telegram:
      return `https://t.me/${username}`
    case SocialType.Farcaster:
      return `https://farcaster.xyz/${username}`
    case SocialType.Website:
      return username
  }
}

export function getImageModelLabel(model?: ImageModel): string {
  if (!model) return IMAGE_MODEL_LABEL[DEFAULT_IMAGE_MODEL]

  return IMAGE_MODEL_LABEL[model]
}

export const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return true
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

export const formatToBreakline = (text: string) => {
  return text.replace(/,[^\n]/g, (m) => m.replace(/,/g, ',\n'))
}
