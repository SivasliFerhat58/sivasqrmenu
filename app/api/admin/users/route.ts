import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'
import { hashPassword, validatePassword, getUserByEmail } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { email, password, name, restaurantId } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Password validation: minimum 8 characters
    if (!(await validatePassword(password))) {
      return NextResponse.json(
        {
          error: `Password must be at least ${8} characters long`,
        },
        { status: 400 }
      )
    }

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Verify restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user with OWNER role
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || null,
        role: 'OWNER',
      },
    })

    // Update restaurant ownerId to the newly created user
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        ownerId: user.id,
      },
    })

    return NextResponse.json(
      {
        message: 'User created successfully and linked to restaurant',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          restaurantId: restaurant.id,
        },
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          subdomain: restaurant.subdomain,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        restaurants: {
          select: {
            id: true,
            name: true,
            subdomain: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ users }, { status: 200 })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

