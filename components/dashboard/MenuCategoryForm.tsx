'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { menuCategorySchema, type MenuCategoryFormData } from '@/lib/validations'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { MenuCategory } from '@prisma/client'

interface MenuCategoryFormProps {
  category?: MenuCategory
}

export default function MenuCategoryForm({ category }: MenuCategoryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MenuCategoryFormData>({
    resolver: zodResolver(menuCategorySchema),
    defaultValues: category
      ? {
          name: category.name,
          order: category.order,
        }
      : {
          order: 0,
        },
  })

  const onSubmit = async (data: MenuCategoryFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const url = category
        ? `/api/menu-categories/${category.id}`
        : '/api/menu-categories'
      const method = category ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Bir hata oluştu')
      }

      router.push('/dashboard/menu-categories')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Kategori Adı *
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Örn: Ana Yemekler"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
            Sıra
          </label>
          <input
            type="number"
            id="order"
            {...register('order', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
          />
          {errors.order && (
            <p className="mt-1 text-sm text-red-600">{errors.order.message}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Kaydediliyor...' : category ? 'Güncelle' : 'Oluştur'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  )
}

