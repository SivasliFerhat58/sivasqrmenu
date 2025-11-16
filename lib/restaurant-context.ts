import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { logger } from './logger'

/**
 * Gets restaurant from request headers (set by middleware)
 * Middleware sets x-subdomain header, and we do the database lookup here
 */
export async function getRestaurantFromHeaders() {
  const headersList = await headers()
  const subdomain = headersList.get('x-subdomain') || headersList.get('x-restaurant-subdomain')

  if (!subdomain) {
    return null
  }

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
              orderBy: {
                createdAt: 'desc',
              },
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                imageUrl: true,
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

    // Convert Decimal price to number for type compatibility
    if (restaurant) {
      return {
        ...restaurant,
        menuCategories: restaurant.menuCategories.map((category) => ({
          ...category,
          menuItems: category.menuItems.map((item) => ({
            ...item,
            price: Number(item.price),
          })),
        })),
      }
    }

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
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                imageUrl: true,
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

    // Convert Decimal price to number for type compatibility
    if (restaurant) {
      return {
        ...restaurant,
        menuCategories: restaurant.menuCategories.map((category) => ({
          ...category,
          menuItems: category.menuItems.map((item) => ({
            ...item,
            price: Number(item.price),
          })),
        })),
      }
    }

    return restaurant
  } catch (error) {
    logger.error('Error fetching restaurant by subdomain:', error)
    return null
  }
}

