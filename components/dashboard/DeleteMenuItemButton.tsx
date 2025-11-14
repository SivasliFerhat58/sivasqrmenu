'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'

interface DeleteMenuItemButtonProps {
  itemId: string
}

export default function DeleteMenuItemButton({ itemId }: DeleteMenuItemButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/menu-items/${itemId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Silme işlemi başarısız')
      }

      router.refresh()
    } catch (error) {
      alert('Bir hata oluştu')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  )
}

