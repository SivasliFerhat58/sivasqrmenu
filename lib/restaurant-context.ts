import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { logger } from './logger'

/**
 * Gets restaurant from request headers (set by middleware)
 */
export async function getRestaurantFromHeaders() {
  const headersList = await headers()
  const restaurantId = headersList.get('x-restaurant-id')
  const subdomain = headersList.get('x-restaurant-subdomain')

  if (!restaurantId && !subdomain) {
    return null
  }

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: restaurantId ? { id: restaurantId } : { subdomain: subdomain! },
      include: {
        menuCategories: {
          include: {
            menuItems: {
              where: {
                isAvailable: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    return restaurant
  } catch (error) {
    logger.error('Error fetching restaurant:', error)
    return null
  }
}

/**
 * Gets restaurant by subdomain (for API routes)
 */
export async function getRestaurantBySubdomain(subdomain: string) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { subdomain },
      include: {
        menuCategories: {
          include: {
            menuItems: {
              where: {
                isAvailable: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    return restaurant
  } catch (error) {
    logger.error('Error fetching restaurant by subdomain:', error)
    return null
  }
}

