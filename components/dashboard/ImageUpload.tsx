'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  error?: string
}

export default function ImageUpload({ value, onChange, error }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Sadece JPEG ve PNG dosyaları yüklenebilir.')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setUploadError('Dosya boyutu 5MB\'dan büyük olamaz.')
      return
    }

    setUploadError(null)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    setUploadProgress(0)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const xhr = new XMLHttpRequest()

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100
          setUploadProgress(percentComplete)
        }
      })

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          // Use imageUrl (large) for backward compatibility, or urls.large
          const imageUrl = response.imageUrl || response.urls?.large
          onChange(imageUrl)
          setUploadProgress(100)
        } else {
          const error = JSON.parse(xhr.responseText)
          setUploadError(error.error || 'Yükleme başarısız')
        }
        setUploading(false)
      })

      // Handle errors
      xhr.addEventListener('error', () => {
        setUploadError('Yükleme sırasında bir hata oluştu')
        setUploading(false)
      })

      xhr.open('POST', '/api/uploads')
      xhr.send(formData)
    } catch (err) {
      setUploadError('Yükleme başarısız')
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden group">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
        )}

        <div className="flex-1">
          <label
            htmlFor="image-upload"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Yükleniyor...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Görsel Seç
              </>
            )}
          </label>
          <input
            ref={fileInputRef}
            id="image-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          <p className="mt-1 text-xs text-gray-500">
            JPEG veya PNG (max 5MB)
          </p>
        </div>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            {Math.round(uploadProgress)}% yüklendi
          </p>
        </div>
      )}

      {(uploadError || error) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
          {uploadError || error}
        </div>
      )}
    </div>
  )
}

