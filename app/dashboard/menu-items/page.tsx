import { requireOwner } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import MenuItemsList from '@/components/dashboard/MenuItemsList'

export default async function MenuItemsPage() {
  const session = await requireOwner()

  // Get user's restaurant
  const restaurant = await prisma.restaurant.findFirst({
    where: { ownerId: session.user.id },
    include: {
      menuCategories: true,
      menuItems: {
        include: {
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!restaurant) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Menü Ürünleri</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              Önce bir restoran oluşturmanız gerekiyor.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menü Ürünleri</h1>
          <p className="text-gray-600 mt-1">
            Ürünleri arayın, filtreleyin ve durumlarını yönetin
          </p>
        </div>
        <Link href="/dashboard/menu-items/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Ürün
          </Button>
        </Link>
      </div>

      {restaurant.menuItems.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Henüz ürün eklenmemiş.</p>
              <Link href="/dashboard/menu-items/new">
                <Button variant="outline">İlk ürünü ekleyin</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Ürünler</CardTitle>
            <CardDescription>
              {restaurant.menuItems.length} ürün bulundu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MenuItemsList
              items={restaurant.menuItems}
              categories={restaurant.menuCategories}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
