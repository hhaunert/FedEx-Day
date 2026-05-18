'use client'

import { useCallback, useState } from 'react'

interface StepUploadProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  isExtracting?: boolean
}

export default function StepUpload({ onFileSelect, selectedFile, isExtracting }: StepUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      const file = e.dataTransfer.files?.[0]
      if (file && file.type.startsWith('image/')) {
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-brand-darker mb-2">
          Upload Your Clipping
        </h2>
        <p className="text-brand-gray-dark">
          Upload a photo or scan of your newspaper clipping. Supports JPG, PNG, and WebP formats.
        </p>
      </div>

      <div
        className={`dropzone ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />

        {selectedFile ? (
          <div className="space-y-4">
            {isExtracting ? (
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                <svg className="animate-spin w-8 h-8 text-brand-red" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div>
              <p className="font-semibold text-brand-darker truncate max-w-xs sm:max-w-sm">{selectedFile.name}</p>
              <p className="text-sm text-brand-gray-mid mt-1">
                {isExtracting ? 'Reading clipping details...' : `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Ready`}
              </p>
            </div>
            {!isExtracting && (
              <button
                type="button"
                className="text-sm text-brand-red hover:underline"
                onClick={(e) => {
                  e.stopPropagation()
                  document.getElementById('file-upload')?.click()
                }}
              >
                Change file
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-brand-gray-lighter rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-brand-gray-mid" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-brand-darker">
                Drag &amp; drop your clipping here
              </p>
              <p className="text-sm text-brand-gray-mid mt-1">
                or click to browse files
              </p>
            </div>
            <p className="text-xs text-brand-gray-mid">
              JPG, PNG, WebP up to 10MB
            </p>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
          <strong>Tip:</strong> For best results, use a clear, well-lit photo with the full article text visible.
        </div>
      )}
    </div>
  )
}
