import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'
import { validateSubdomain, normalizeSubdomain } from '@/lib/subdomain'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const restaurants = await prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        subdomain: true,
        description: true,
        isActive: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ restaurants }, { status: 200 })
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { name, subdomain, description } = body

    if (!name || !subdomain) {
      return NextResponse.json(
        { error: 'Restaurant name and subdomain are required' },
        { status: 400 }
      )
    }

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

    // Note: Restaurant requires an ownerId, so we need to create a placeholder owner first
    // Or we can create restaurant without owner and assign later
    // For now, we'll require that a user is created first and linked to restaurant
    // This endpoint creates restaurant without owner (owner can be assigned later via user creation)

    // Actually, looking at schema, ownerId is required. So we need a different approach.
    // Option 1: Create a temporary owner user
    // Option 2: Make ownerId optional in schema (migration needed)
    // Option 3: Require ownerId in this endpoint
    
    // For now, let's make it so admin creates restaurant, then creates user and links them
    // But schema requires ownerId, so we need to handle this differently
    
    // Let's create a temporary system user or make ownerId nullable
    // Actually, the best approach: Admin creates user first, then restaurant with that user's ID
    // But user wants to create restaurant first, then user
    
    // Solution: Create restaurant with a placeholder, then update when user is created
    // Or: Create both in one transaction
    
    // For simplicity, let's require ownerId in the request for now
    // But the user wants to create restaurant first, then user
    
    // Let's check if we can make ownerId optional temporarily
    // Actually, let's create a system admin user first if it doesn't exist, then use that
    
    // Better solution: Create restaurant with a temporary owner, then when user is created, update the owner
    // But that's complex. Let's just require ownerId for now and document it.
    
    // Wait, the requirement says: "Restorana bağlı yeni kullanıcı (OWNER) oluştur"
    // So the flow should be: Create restaurant first, then create user and link to restaurant
    // But schema requires ownerId. We need to either:
    // 1. Make ownerId optional (migration)
    // 2. Create a placeholder owner
    
    // Let's go with option 1: Make ownerId optional temporarily, then update when user is created
    // But that requires schema change. Let's use a workaround:
    // Create a system user first, use that as owner, then when real user is created, update
    
    // Actually, simplest: Create restaurant with a system admin as owner, then when user is created, transfer ownership
    // But that's also complex.
    
    // Best approach for now: Create restaurant, but we need an ownerId. 
    // Let's create a system user if it doesn't exist, use that as placeholder owner
    
    // Find or create system admin user
    let systemAdmin = await prisma.user.findFirst({
      where: { email: 'system@admin.local' },
    })

    if (!systemAdmin) {
      // Create system admin user (this should be done via migration, but for now...)
      const { hashPassword } = await import('@/lib/auth')
      const passwordHash = await hashPassword('system-admin-password-change-me')
      
      systemAdmin = await prisma.user.create({
        data: {
          email: 'system@admin.local',
          passwordHash,
          role: 'ADMIN',
          name: 'System Admin',
        },
      })
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        ownerId: systemAdmin.id, // Temporary owner, will be updated when user is created
        name,
        subdomain: normalizedSubdomain,
        description: description || null,
      },
    })

    return NextResponse.json(
      {
        message: 'Restaurant created successfully',
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          subdomain: restaurant.subdomain,
          description: restaurant.description,
        },
        note: 'Restaurant created with temporary owner. Create a user to assign as owner.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating restaurant:', error)
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    )
  }
}

