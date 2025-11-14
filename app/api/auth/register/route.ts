import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  hashPassword,
  validatePassword,
  getUserByEmail,
  createUser,
} from '@/lib/auth'
import { validateSubdomain, normalizeSubdomain } from '@/lib/subdomain'

// TODO: Add rate limiting to prevent brute force attacks
// Consider using: next-rate-limit, upstash/ratelimit, or similar
// Example: limit to 5 requests per 15 minutes per IP

// Registration is disabled - only admins can create users
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Registration is disabled. Please contact an administrator.' },
    { status: 403 }
  )
}

// Legacy code kept for reference - registration disabled
export async function POST_DISABLED(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, restaurantName, subdomain } = body

    // Validation
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

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user (role: OWNER)
    const user = await createUser(email, passwordHash, name, 'OWNER')

    // Optionally create restaurant if restaurantName and subdomain are provided
    let restaurantId = null
    if (restaurantName && subdomain) {
      // Normalize and validate subdomain
      const normalizedSubdomain = normalizeSubdomain(subdomain)
      const validation = validateSubdomain(normalizedSubdomain)

      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error || 'Invalid subdomain' },
          { status: 400 }
        )
      }

      // Check if subdomain is already taken
      const existingRestaurant = await prisma.restaurant.findUnique({
        where: { subdomain: normalizedSubdomain },
      })

      if (existingRestaurant) {
        return NextResponse.json(
          { error: 'Subdomain is already taken' },
          { status: 409 }
        )
      }

      const restaurant = await prisma.restaurant.create({
        data: {
          ownerId: user.id,
          name: restaurantName,
          subdomain: normalizedSubdomain,
        },
      })

      restaurantId = restaurant.id
    }

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          restaurantId,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

