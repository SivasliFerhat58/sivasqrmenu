import { z } from 'zod'

export const menuCategorySchema = z.object({
  name: z.string().min(1, 'Kategori adı gereklidir').max(100, 'Kategori adı çok uzun'),
  order: z.number().int().min(0, 'Sıra 0 veya daha büyük olmalıdır').default(0),
})

export const menuItemSchema = z.object({
  name: z.string().min(1, 'Ürün adı gereklidir').max(100, 'Ürün adı çok uzun'),
  description: z.string().max(500, 'Açıklama çok uzun').optional(),
  price: z.string().refine(
    (val) => {
      const num = parseFloat(val)
      return !isNaN(num) && num > 0
    },
    { message: 'Geçerli bir fiyat giriniz (0\'dan büyük)' }
  ),
  categoryId: z.string().min(1, 'Kategori seçiniz'),
  imageUrl: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
  isAvailable: z.boolean().default(true),
})

export type MenuCategoryFormData = z.infer<typeof menuCategorySchema>
export type MenuItemFormData = z.infer<typeof menuItemSchema>

