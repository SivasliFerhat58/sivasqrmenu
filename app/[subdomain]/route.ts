import { NextRequest, NextResponse } from 'next/server'
import { getRestaurantFromHeaders } from '@/lib/restaurant-context'
import { getPageViewsFromHeaders } from '@/lib/analytics'

/**
 * API route for subdomain pages
 * Handles cache headers and analytics tracking
 */
export async function GET(request: NextRequest) {
  const restaurant = await getRestaurantFromHeaders()

  if (!restaurant) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
  }

  // Track page view (non-blocking)
  getPageViewsFromHeaders(restaurant.id, '/').catch(console.error)

  // Set cache headers
  const response = NextResponse.json(
    { restaurant: { id: restaurant.id, name: restaurant.name } },
    {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  )

  return response
}

