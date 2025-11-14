import { prisma } from './prisma'
import { headers } from 'next/headers'
import { logger } from './logger'

export async function trackPageView(
  restaurantId: string,
  path: string,
  userAgent?: string | null,
  referer?: string | null
) {
  try {
    await prisma.pageView.create({
      data: {
        restaurantId,
        path,
        userAgent: userAgent || null,
        referer: referer || null,
      },
    })
  } catch (error) {
    logger.error('Error tracking page view:', error)
    // Don't throw - analytics shouldn't break the page
  }
}

export async function getPageViewsFromHeaders(
  restaurantId: string,
  path: string
) {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')
  const referer = headersList.get('referer')

  await trackPageView(restaurantId, path, userAgent, referer)
}

