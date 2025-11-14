'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}

