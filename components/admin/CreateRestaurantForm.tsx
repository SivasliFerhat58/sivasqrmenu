'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { validateSubdomain, normalizeSubdomain } from '@/lib/subdomain'

const restaurantSchema = z.object({
  name: z.string().min(1, 'Restoran adı gereklidir').max(100, 'Restoran adı çok uzun'),
  subdomain: z.string().min(3, 'Subdomain en az 3 karakter olmalıdır'),
  description: z.string().max(500, 'Açıklama çok uzun').optional(),
})

type RestaurantFormData = z.infer<typeof restaurantSchema>

export default function CreateRestaurantForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
  })

  const onSubmit = async (data: RestaurantFormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    // Validate subdomain
    const normalizedSubdomain = normalizeSubdomain(data.subdomain)
    const validation = validateSubdomain(normalizedSubdomain)

    if (!validation.valid) {
      setError(validation.error || 'Geçersiz subdomain')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/admin/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          subdomain: normalizedSubdomain,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Restoran oluşturulamadı')
      }

      setSuccess(`Restoran "${result.restaurant.name}" başarıyla oluşturuldu!`)
      reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
          {success}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Restoran Adı *
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Örn: Lezzet Durağı"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700 mb-1">
          Subdomain *
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            id="subdomain"
            {...register('subdomain')}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="myrestaurant"
          />
          <span className="text-sm text-gray-500 whitespace-nowrap">
            .{process.env.NEXT_PUBLIC_BASE_DOMAIN || 'example.com'}
          </span>
        </div>
        {errors.subdomain && (
          <p className="mt-1 text-sm text-red-600">{errors.subdomain.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Sadece küçük harf, rakam ve tire (-) kullanılabilir
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Açıklama
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Restoran açıklaması..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Oluşturuluyor...' : 'Restoran Oluştur'}
      </button>
    </form>
  )
}

