import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'
import { menuCategorySchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const session = await requireOwner()

    const restaurant = await prisma.restaurant.findFirst({
      where: { ownerId: session.user.id },
      include: {
        menuCategories: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!restaurant) {
      return NextResponse.json({ categories: [] }, { status: 200 })
    }

    return NextResponse.json({ categories: restaurant.menuCategories }, { status: 200 })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireOwner()

    const body = await request.json()
    const validatedData = menuCategorySchema.parse(body)

    const restaurant = await prisma.restaurant.findFirst({
      where: { ownerId: session.user.id },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    const category = await prisma.menuCategory.create({
      data: {
        restaurantId: restaurant.id,
        name: validatedData.name,
        order: validatedData.order,
      },
    })

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      )
    }
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

