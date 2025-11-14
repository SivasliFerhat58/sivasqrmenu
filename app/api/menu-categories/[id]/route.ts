import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'
import { menuCategorySchema } from '@/lib/validations'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const category = await prisma.menuCategory.findFirst({
      where: {
        id: params.id,
        restaurantId: restaurant.id,
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const updatedCategory = await prisma.menuCategory.update({
      where: { id: params.id },
      data: {
        name: validatedData.name,
        order: validatedData.order,
      },
    })

    return NextResponse.json({ category: updatedCategory }, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      )
    }
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
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

    const category = await prisma.menuCategory.findFirst({
      where: {
        id: params.id,
        restaurantId: restaurant.id,
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    await prisma.menuCategory.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Category deleted' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}

