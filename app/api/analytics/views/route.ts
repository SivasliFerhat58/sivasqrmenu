import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// Force dynamic rendering for API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await requireOwner()

    const restaurant = await prisma.restaurant.findFirst({
      where: { ownerId: session.user.id },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Daily views for the last N days - using Prisma query instead of raw SQL for better compatibility
    const allViews = await prisma.pageView.findMany({
      where: {
        restaurantId: restaurant.id,
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
      },
    })

    // Group by date
    const dailyViewsMap = new Map<string, number>()
    allViews.forEach((view) => {
      const date = view.createdAt.toISOString().split('T')[0]
      dailyViewsMap.set(date, (dailyViewsMap.get(date) || 0) + 1)
    })

    const dailyViews = Array.from(dailyViewsMap.entries())
      .map(([date, count]) => ({ date, count: Number(count) }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Top categories (by menu items count)
    const allCategories = await prisma.menuCategory.findMany({
      where: {
        restaurantId: restaurant.id,
      },
      include: {
        menuItems: {
          select: {
            id: true,
          },
        },
      },
    })

    // Sort by menu items count and take top 5
    const topCategories = allCategories
      .sort((a, b) => b.menuItems.length - a.menuItems.length)
      .slice(0, 5)
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        itemCount: cat.menuItems.length,
      }))

    // Total views
    const totalViews = await prisma.pageView.count({
      where: {
        restaurantId: restaurant.id,
        createdAt: {
          gte: startDate,
        },
      },
    })

    // Views today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const viewsToday = await prisma.pageView.count({
      where: {
        restaurantId: restaurant.id,
        createdAt: {
          gte: today,
        },
      },
    })

    return NextResponse.json(
      {
        dailyViews: dailyViews,
        topCategories: topCategories,
        totalViews: totalViews || 0,
        viewsToday: viewsToday || 0,
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

