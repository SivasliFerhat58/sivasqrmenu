import { getRestaurantFromHeaders } from '@/lib/restaurant-context'
import { notFound } from 'next/navigation'
import MenuCategory from '@/components/MenuCategory'
import { getPageViewsFromHeaders } from '@/lib/analytics'
import { logger } from '@/lib/logger'

/**
 * Public menu page for subdomain
 * Example: myrestaurant.example.com -> shows menu for "myrestaurant"
 * 
 * Dynamic rendering: Required for analytics tracking and subdomain-based routing
 */
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function SubdomainPage({
  params,
}: {
  params: Promise<{ subdomain: string }> | { subdomain: string }
}) {
  // Handle both sync and async params (Next.js 14+)
  const resolvedParams = await Promise.resolve(params)
  
  logger.debug('[SubdomainPage] Params:', resolvedParams)
  
  // Try to get restaurant from headers first (set by middleware)
  let restaurant = await getRestaurantFromHeaders()
  logger.debug('[SubdomainPage] Restaurant from headers:', restaurant ? restaurant.name : 'not found')

  // If not found in headers, try to get by subdomain from params (fallback)
  if (!restaurant && resolvedParams.subdomain) {
    logger.debug('[SubdomainPage] Trying to get restaurant by subdomain from params:', resolvedParams.subdomain)
    const { getRestaurantBySubdomain } = await import('@/lib/restaurant-context')
    restaurant = await getRestaurantBySubdomain(resolvedParams.subdomain)
    logger.debug('[SubdomainPage] Restaurant from params:', restaurant ? restaurant.name : 'not found')
  }

  if (!restaurant) {
    logger.warn('[SubdomainPage] Restaurant not found, returning 404')
    notFound()
  }

  // Track page view (non-blocking, wrapped in try-catch for build safety)
  try {
    getPageViewsFromHeaders(restaurant.id, '/').catch((error) => {
      logger.error('[SubdomainPage] Error tracking page view:', error)
    })
  } catch (error) {
    // Silently fail during build - analytics shouldn't break the page
    logger.debug('[SubdomainPage] Analytics tracking skipped during build')
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
