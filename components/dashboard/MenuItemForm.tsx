'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { menuItemSchema, type MenuItemFormData } from '@/lib/validations'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { MenuItem, MenuCategory } from '@prisma/client'
import ImageUpload from './ImageUpload'

interface MenuItemFormProps {
  item?: MenuItem & { category: MenuCategory }
}

export default function MenuItemForm({ item }: MenuItemFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || '')

  useEffect(() => {
    // Fetch categories
    fetch('/api/menu-categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch((err) => console.error('Error fetching categories:', err))
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: item
      ? {
          name: item.name,
          description: item.description || '',
          price: Number(item.price).toString(),
          categoryId: item.categoryId,
          imageUrl: item.imageUrl || '',
          isAvailable: item.isAvailable,
        }
      : {
          isAvailable: true,
        },
  })

  // Sync imageUrl with form
  useEffect(() => {
    setValue('imageUrl', imageUrl)
  }, [imageUrl, setValue])

  const onSubmit = async (data: MenuItemFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const url = item ? `/api/menu-items/${item.id}` : '/api/menu-items'
      const method = item ? 'PUT' : 'POST'

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

      router.push('/dashboard/menu-items')
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
            Ürün Adı *
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Örn: Döner Tabağı"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Açıklama
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ürün açıklaması..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Fiyat (₺) *
            </label>
            <input
              type="number"
              id="price"
              step="0.01"
              min="0"
              {...register('price')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
              Kategori *
            </label>
            <select
              id="categoryId"
              {...register('categoryId')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Kategori seçiniz</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ürün Görseli
          </label>
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            error={errors.imageUrl?.message}
          />
          <input type="hidden" {...register('imageUrl')} />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('isAvailable')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Ürün mevcut</span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Kaydediliyor...' : item ? 'Güncelle' : 'Oluştur'}
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

