import { getRestaurantFromHeaders } from '@/lib/restaurant-context'
import { notFound } from 'next/navigation'
import MenuCategory from '@/components/MenuCategory'

/**
 * Public menu page for subdomain
 * Example: myrestaurant.example.com -> shows menu for "myrestaurant"
 * 
 * ISR: Revalidate every 60 seconds for performance optimization
 */
export const revalidate = 60

export default async function SubdomainPage() {
  const restaurant = await getRestaurantFromHeaders()

  if (!restaurant) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {restaurant.name}
              </h1>
              {restaurant.description && (
                <p className="mt-2 text-sm sm:text-base text-gray-600">
                  {restaurant.description}
                </p>
              )}
            </div>
            {restaurant.logoUrl && (
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                <img
                  src={restaurant.logoUrl}
                  alt={restaurant.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Menu */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {restaurant.menuCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Menü henüz hazırlanmamış.</p>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-12">
            {restaurant.menuCategories.map((category) => (
              <MenuCategory key={category.id} category={category} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
