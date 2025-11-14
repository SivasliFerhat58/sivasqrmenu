import { getRestaurantFromHeaders } from '@/lib/restaurant-context'
import { notFound } from 'next/navigation'
import Image from 'next/image'

/**
 * Public menu page for subdomain
 * Example: myrestaurant.example.com -> shows menu for "myrestaurant"
 */
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {restaurant.name}
              </h1>
              {restaurant.description && (
                <p className="mt-2 text-gray-600">{restaurant.description}</p>
              )}
            </div>
            {restaurant.logoUrl && (
              <div className="relative w-24 h-24">
                <Image
                  src={restaurant.logoUrl}
                  alt={restaurant.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Menu */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {restaurant.menuCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Menü henüz hazırlanmamış.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {restaurant.menuCategories.map((category) => (
              <section key={category.id}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {category.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {item.imageUrl && (
                        <div className="relative w-full h-48">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="mt-2 text-sm text-gray-600">
                            {item.description}
                          </p>
                        )}
                        <p className="mt-4 text-xl font-bold text-blue-600">
                          {Number(item.price).toFixed(2)} ₺
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

