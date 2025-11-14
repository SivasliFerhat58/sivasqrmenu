import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'
import { validateSubdomain, normalizeSubdomain } from '@/lib/subdomain'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// TODO: Implement email verification for subdomain changes
// This is a placeholder - in production, you should:
// 1. Generate a verification token
// 2. Send email with verification link
// 3. Only update subdomain after email verification

export async function PUT(request: NextRequest) {
  try {
    const session = await requireOwner()
    const body = await request.json()
    const { newSubdomain } = body

    if (!newSubdomain) {
      return NextResponse.json(
        { error: 'New subdomain is required' },
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

    // Normalize and validate subdomain
    const normalizedSubdomain = normalizeSubdomain(newSubdomain)
    const validation = validateSubdomain(normalizedSubdomain)

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid subdomain' },
        { status: 400 }
      )
    }

    // Check if subdomain is already taken (by another restaurant)
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { subdomain: normalizedSubdomain },
    })

    if (existingRestaurant && existingRestaurant.id !== restaurant.id) {
      return NextResponse.json(
        { error: 'Subdomain is already taken' },
        { status: 409 }
      )
    }

    // If subdomain is the same, no change needed
    if (restaurant.subdomain === normalizedSubdomain) {
      return NextResponse.json(
        { message: 'Subdomain unchanged', subdomain: normalizedSubdomain },
        { status: 200 }
      )
    }

    // TODO: In production, implement email verification here
    // For now, we'll update directly (not recommended for production)
    // 
    // Example flow:
    // 1. Create SubdomainChangeRequest record with token
    // 2. Send email to owner with verification link
    // 3. On verification, update subdomain
    // 4. Invalidate old subdomain cache/CDN

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: {
        subdomain: normalizedSubdomain,
      },
    })

    // Log the change in audit
    await prisma.audit.create({
      data: {
        restaurantId: restaurant.id,
        action: 'SUBDOMAIN_CHANGED',
        payload: {
          oldSubdomain: restaurant.subdomain,
          newSubdomain: normalizedSubdomain,
          changedBy: session.user.id,
          changedAt: new Date().toISOString(),
        },
      },
    })

    return NextResponse.json(
      {
        message: 'Subdomain updated successfully',
        subdomain: updatedRestaurant.subdomain,
        // TODO: Remove this in production - add email verification instead
        warning: 'Email verification not implemented - subdomain changed directly',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Subdomain update error:', error)
    return NextResponse.json(
      { error: 'Failed to update subdomain' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireOwner()

    const restaurant = await prisma.restaurant.findFirst({
      where: { ownerId: session.user.id },
      select: {
        id: true,
        subdomain: true,
        name: true,
      },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        subdomain: restaurant.subdomain,
        fullUrl: `${restaurant.subdomain}.${process.env.BASE_DOMAIN || 'example.com'}`,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching subdomain:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subdomain' },
      { status: 500 }
    )
  }
}

