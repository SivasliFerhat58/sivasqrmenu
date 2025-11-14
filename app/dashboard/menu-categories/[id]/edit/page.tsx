import { requireOwner } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import MenuCategoryForm from '@/components/dashboard/MenuCategoryForm'

export default async function EditMenuCategoryPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await requireOwner()

  const restaurant = await prisma.restaurant.findFirst({
    where: { ownerId: session.user.id },
  })

  if (!restaurant) {
    notFound()
  }

  const category = await prisma.menuCategory.findFirst({
    where: {
      id: params.id,
      restaurantId: restaurant.id,
    },
  })

  if (!category) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kategori Düzenle</h1>
      <MenuCategoryForm category={category} />
    </div>
  )
}

