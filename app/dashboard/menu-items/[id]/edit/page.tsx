import { requireOwner } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import MenuItemForm from '@/components/dashboard/MenuItemForm'

export default async function EditMenuItemPage({
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

  const item = await prisma.menuItem.findFirst({
    where: {
      id: params.id,
      category: {
        restaurantId: restaurant.id,
      },
    },
    include: {
      category: true,
    },
  })

  if (!item) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Ürün Düzenle</h1>
      <MenuItemForm item={item} />
    </div>
  )
}

