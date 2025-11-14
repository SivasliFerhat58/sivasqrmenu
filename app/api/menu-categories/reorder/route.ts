import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await requireOwner()

    const body = await request.json()
    const { categories } = body

    if (!Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // Get user's restaurant
    const restaurant = await prisma.restaurant.findFirst({
      where: { ownerId: session.user.id },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    // Update all categories in a transaction
    await prisma.$transaction(
      categories.map((cat: { id: string; order: number }) =>
        prisma.menuCategory.update({
          where: {
            id: cat.id,
            restaurantId: restaurant.id,
          },
          data: {
            order: cat.order,
          },
        })
      )
    )

    return NextResponse.json(
      { message: 'Categories reordered successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Reorder error:', error)
    return NextResponse.json(
      { error: 'Failed to reorder categories' },
      { status: 500 }
    )
  }
}

