'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { menuItemSchema, type MenuItemFormData } from '@/lib/validations'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { MenuItem, MenuCategory } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ImageUploader from '@/components/ui/ImageUploader'

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
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{item ? 'Ürün Düzenle' : 'Yeni Ürün'}</CardTitle>
        <CardDescription>
          {item ? 'Ürün bilgilerini güncelleyin' : 'Yeni bir ürün oluşturun'}
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
            <Label htmlFor="name">Ürün Adı *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Örn: Döner Tabağı"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Ürün açıklaması..."
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Fiyat (₺) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register('price')}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Kategori *</Label>
              <Select
                id="categoryId"
                {...register('categoryId')}
              >
                <option value="">Kategori seçiniz</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-600">{errors.categoryId.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ürün Görseli</Label>
            <ImageUploader
              value={imageUrl}
              onChange={setImageUrl}
              error={errors.imageUrl?.message}
            />
            <input type="hidden" {...register('imageUrl')} />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isAvailable"
              {...register('isAvailable')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="isAvailable" className="!mt-0 cursor-pointer">
              Ürün mevcut
            </Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Kaydediliyor...' : item ? 'Güncelle' : 'Oluştur'}
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
