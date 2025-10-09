/**
 * Convert a File to base64 string asynchronously
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result as string
      resolve(result || '')
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Convert a File to base64 string with fallback
 */
export const fileToBase64WithFallback = async (
  file: File,
  fallback: string = '',
): Promise<string> => {
  try {
    return await fileToBase64(file)
  } catch (error) {
    return fallback
  }
}
