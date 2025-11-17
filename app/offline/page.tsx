'use client'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">İnternet Bağlantısı Yok</h1>
        <p className="text-gray-600 mb-6">
          İnternet bağlantınızı kontrol edin ve tekrar deneyin.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Yeniden Dene
        </button>
      </div>
    </div>
  )
}

