'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'

interface DeleteCategoryButtonProps {
  categoryId: string
}

export default function DeleteCategoryButton({ categoryId }: DeleteCategoryButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/menu-categories/${categoryId}`, {
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

