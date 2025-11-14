import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'
import { menuItemSchema } from '@/lib/validations'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const session = await requireOwner()

    const restaurant = await prisma.restaurant.findFirst({
      where: { ownerId: session.user.id },
      include: {
        menuCategories: {
          include: {
            menuItems: {
              include: {
                category: true,
              },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    })

    if (!restaurant) {
      return NextResponse.json({ items: [] }, { status: 200 })
    }

    // Flatten menuItems from all categories
    const menuItems = restaurant.menuCategories.flatMap((category) =>
      category.menuItems.map((item) => ({
        ...item,
        category: {
          id: category.id,
          name: category.name,
        },
      }))
    )

    return NextResponse.json({ items: menuItems }, { status: 200 })
  } catch (error) {
    logger.error('Error fetching menu items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireOwner()

    const body = await request.json()
    const validatedData = menuItemSchema.parse(body)

    const restaurant = await prisma.restaurant.findFirst({
      where: { ownerId: session.user.id },
      include: {
        menuCategories: true,
      },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    // Verify category belongs to restaurant
    const category = restaurant.menuCategories.find(
      (cat) => cat.id === validatedData.categoryId
    )

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found or does not belong to your restaurant' },
        { status: 404 }
      )
    }

    const item = await prisma.menuItem.create({
      data: {
        categoryId: validatedData.categoryId,
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        imageUrl: validatedData.imageUrl || null,
        isAvailable: validatedData.isAvailable,
      },
    })

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      )
    }
    logger.error('Error creating menu item:', error)
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
}

