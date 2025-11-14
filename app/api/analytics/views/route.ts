import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'

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

    // Daily views for the last N days
    const dailyViews = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT 
        DATE(created_at) as date,
        COUNT(*)::bigint as count
      FROM page_views
      WHERE restaurant_id = ${restaurant.id}
        AND created_at >= ${startDate}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `

    // Top categories (by menu items views - simplified)
    const topCategories = await prisma.menuCategory.findMany({
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
      orderBy: {
        menuItems: {
          _count: 'desc',
        },
      },
      take: 5,
    })

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
        dailyViews: dailyViews.map((v) => ({
          date: v.date,
          count: Number(v.count),
        })),
        topCategories: topCategories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          itemCount: cat.menuItems.length,
        })),
        totalViews,
        viewsToday,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

