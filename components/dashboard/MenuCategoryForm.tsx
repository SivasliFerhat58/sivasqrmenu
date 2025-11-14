'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { menuCategorySchema, type MenuCategoryFormData } from '@/lib/validations'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { MenuCategory } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{category ? 'Kategori Düzenle' : 'Yeni Kategori'}</CardTitle>
        <CardDescription>
          {category ? 'Kategori bilgilerini güncelleyin' : 'Yeni bir kategori oluşturun'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Kategori Adı *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Örn: Ana Yemekler"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Sıra</Label>
            <Input
              id="order"
              type="number"
              {...register('order', { valueAsNumber: true })}
              min="0"
            />
            {errors.order && (
              <p className="text-sm text-red-600">{errors.order.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Kaydediliyor...' : category ? 'Güncelle' : 'Oluştur'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              İptal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
