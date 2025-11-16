import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    const users = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
      },
      take: 5,
    })

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount,
      users,
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
      },
    })
  } catch (error) {
    console.error('[TestDB] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

