'use client'

import { useState, useEffect } from 'react'
import { Download, QrCode } from 'lucide-react'
import { generateQrCodeDataURL, generateQrCodePNG, generateQrCodeSVG } from '@/utils/generateQr'

interface QRCodeGeneratorProps {
  restaurantName: string
  subdomain: string
  publicUrl: string
}

export default function QRCodeGenerator({
  restaurantName,
  subdomain,
  publicUrl,
}: QRCodeGeneratorProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const generateQR = async () => {
      try {
        setLoading(true)
        const dataUrl = await generateQrCodeDataURL(publicUrl, 512)
        setQrCodeDataUrl(dataUrl)
        setError(null)
      } catch (err) {
        setError('QR kod oluşturulamadı')
        console.error('QR code generation error:', err)
      } finally {
        setLoading(false)
      }
    }

    generateQR()
  }, [publicUrl])

  const handleDownloadPNG = async () => {
    try {
      const buffer = await generateQrCodePNG(publicUrl, 1024)
      // Convert Buffer to Uint8Array for browser compatibility
      const uint8Array = new Uint8Array(buffer)
      const blob = new Blob([uint8Array], { type: 'image/png' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${subdomain}-qr-code.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download PNG error:', err)
      alert('PNG indirme başarısız')
    }
  }

  const handleDownloadSVG = async () => {
    try {
      const svg = await generateQrCodeSVG(publicUrl, 1024)
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${subdomain}-qr-code.svg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download SVG error:', err)
      alert('SVG indirme başarısız')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {restaurantName}
        </h2>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Public URL:</span>{' '}
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            {publicUrl}
          </a>
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Bu QR kodu yazdırıp masalara yerleştirebilirsiniz. Müşteriler QR kodu tarayarak menünüze erişebilir.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {qrCodeDataUrl && !loading && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <img
                src={qrCodeDataUrl}
                alt="QR Code"
                className="w-64 h-64 sm:w-80 sm:h-80"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownloadPNG}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              PNG İndir
            </button>
            <button
              onClick={handleDownloadSVG}
              className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              SVG İndir
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

