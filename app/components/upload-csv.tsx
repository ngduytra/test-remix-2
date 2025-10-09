import React, { useState, useRef } from 'react'
import { Upload, FileText } from 'lucide-react'

import { CloseIcon, ErrorIcon, LoadingIcon } from './icons'

import { DEFAULT_MAX_FILE_SIZE } from '@/constants'
import { cn } from '@/utils'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

interface CSVData {
  headers: string[]
  rows: string[][]
  rowCount: number
}

type CSVUploadButtonProps = {
  onUpload: (headers: string[], rows: string[][]) => void
  maxSize?: number
  wrapClassName?: string
  uploadButtonClassName?: string
  resetButtonClassName?: string
}

const CSVUploadButton: React.FC<CSVUploadButtonProps> = ({
  onUpload,
  maxSize = DEFAULT_MAX_FILE_SIZE,
  wrapClassName,
  uploadButtonClassName,
  resetButtonClassName,
}: CSVUploadButtonProps) => {
  const [error, setError] = useState('')
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const [fileName, setFileName] = useState<string>('')
  const [, setCsvData] = useState<CSVData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = event.target.files?.[0]

    if (!file) return

    // Check if file is CSV
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadStatus('error')
      setError('CSV file required')
      return
    }

    if (file.size > maxSize) {
      setUploadStatus('error')
      setError('Not allowed size')
      return
    }

    setFileName(file.name)
    setUploadStatus('uploading')

    // Simulate file processing
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>): void => {
      try {
        const csvText = e.target?.result as string
        const lines = csvText.split('\n')
        const headers = lines[0].split(',').map((h) => h.trim())
        const rows = lines
          .slice(1)
          .filter((line) => line.trim())
          .map((line) => line.split(',').map((cell) => cell.trim()))

        onUpload(headers, rows)
        setCsvData({ headers, rows, rowCount: rows.length })
        setUploadStatus('success')
      } catch (error: unknown) {
        setUploadStatus('error')
        setError('Invalid CSV file')
      }
    }

    reader.onerror = (): void => {
      setUploadStatus('error')
      setError('Failed to read file')
    }

    reader.readAsText(file)
  }

  const handleButtonClick = (): void => {
    fileInputRef.current?.click()
  }

  const resetUpload = (): void => {
    setUploadStatus('idle')
    setFileName('')
    setCsvData(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={cn('flex justify-center items-center', wrapClassName)}>
      <button
        onClick={handleButtonClick}
        disabled={uploadStatus === 'uploading'}
        className={cn(
          'hidden w-full items-center justify-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium bg-primary border-gray-300 text-neutral-900',

          uploadStatus === 'uploading'
            ? 'cursor-not-allowed opacity-70'
            : 'cursor-pointer',
          uploadStatus === 'idle' && 'flex',
          uploadButtonClassName,
        )}
      >
        <Upload className="size-4" />
        <span className="h-[17px]">
          {uploadStatus === 'idle' && 'Upload CSV'}
          {uploadStatus === 'uploading' && 'Processing...'}
          {uploadStatus === 'error' && 'Upload Failed'}
        </span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
        className="hidden"
      />

      {uploadStatus !== 'idle' && (
        <div
          className={cn(
            'flex items-center gap-2 p-3 bg-gray-50 rounded-md',
            resetButtonClassName,
          )}
        >
          <FileText className="h-[18px] w-[18px] text-primary round" />
          <span className="text-sm text-neutral-900 flex-1">{fileName}</span>

          {uploadStatus === 'uploading' && (
            <LoadingIcon className="size-[18px]" />
          )}
          {uploadStatus === 'success' && (
            <button
              onClick={resetUpload}
              className={cn(
                'text-xs text-gray-500 hover:text-gray-700 underline',
              )}
            >
              <CloseIcon className="size-[18px]" />
            </button>
          )}
          {uploadStatus === 'error' && (
            <div className="flex flex-nowrap">
              <ErrorIcon className="size-[18px] text-red-300" />
              <span className="text-sm text-red-300">{error}</span>&nbsp;
              <div
                className="text-sm text-neutral-900 underline"
                onClick={resetUpload}
              >
                Try again
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CSVUploadButton
