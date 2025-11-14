import { requireOwner } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CategoryList from '@/components/dashboard/CategoryList'

export default async function MenuCategoriesPage() {
  const session = await requireOwner()

  // Get user's restaurant
  const restaurant = await prisma.restaurant.findFirst({
    where: { ownerId: session.user.id },
    include: {
      menuCategories: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!restaurant) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Menü Kategorileri</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Menü Kategorileri</h1>
          <p className="text-gray-600 mt-1">
            Kategorileri sürükle-bırak ile sıralayabilirsiniz
          </p>
        </div>
        <Link href="/dashboard/menu-categories/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Kategori
          </Button>
        </Link>
      </div>

      {restaurant.menuCategories.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Henüz kategori eklenmemiş.</p>
              <Link href="/dashboard/menu-categories/new">
                <Button variant="outline">İlk kategoriyi ekleyin</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Kategoriler</CardTitle>
            <CardDescription>
              Kategorileri sürükle-bırak ile yeniden sıralayın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryList
              categories={restaurant.menuCategories}
              restaurantId={restaurant.id}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
