import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractSubdomainFromHost } from '@/lib/subdomain'

// Routes that should not be affected by subdomain routing
const EXCLUDED_PATHS = [
  '/api',
  '/_next',
  '/favicon.ico',
  '/uploads',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for excluded paths
  if (EXCLUDED_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const host = request.headers.get('host') || ''
  const baseDomain = process.env.BASE_DOMAIN || 'localhost:3000'

  // Extract subdomain from host
  const subdomain = extractSubdomainFromHost(host, baseDomain)

  // If no subdomain, continue to main app (dashboard, auth, etc.)
  if (!subdomain) {
    return NextResponse.next()
  }

  // Validate subdomain format
  if (!/^[a-z0-9-]+$/.test(subdomain)) {
    return NextResponse.rewrite(new URL('/404', request.url))
  }

  try {
    // Find restaurant by subdomain
    const restaurant = await prisma.restaurant.findUnique({
      where: { subdomain },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    if (!restaurant) {
      return NextResponse.rewrite(new URL('/404', request.url))
    }

    if (!restaurant.isActive) {
      return NextResponse.rewrite(new URL('/inactive', request.url))
    }

    // Add restaurant data to request headers for use in pages
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-restaurant-id', restaurant.id)
    requestHeaders.set('x-restaurant-subdomain', restaurant.subdomain)
    requestHeaders.set('x-restaurant-name', restaurant.name)

    // Rewrite to public menu page (you'll create this)
    // For now, we'll add the restaurant context to headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    // Also set cookies for client-side access (optional)
    response.cookies.set('restaurant-id', restaurant.id, {
      path: '/',
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

