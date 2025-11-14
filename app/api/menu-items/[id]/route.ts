import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'
import { menuItemSchema } from '@/lib/validations'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify item belongs to restaurant
    const existingItem = await prisma.menuItem.findFirst({
      where: {
        id: params.id,
        category: {
          restaurantId: restaurant.id,
        },
      },
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
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

    const updatedItem = await prisma.menuItem.update({
      where: { id: params.id },
      data: {
        categoryId: validatedData.categoryId,
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        imageUrl: validatedData.imageUrl || null,
        isAvailable: validatedData.isAvailable,
      },
    })

    return NextResponse.json({ item: updatedItem }, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      )
    }
    console.error('Error updating menu item:', error)
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const item = await prisma.menuItem.findFirst({
      where: {
        id: params.id,
        category: {
          restaurantId: restaurant.id,
        },
      },
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      )
    }

    await prisma.menuItem.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Menu item deleted' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting menu item:', error)
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    )
  }
}

