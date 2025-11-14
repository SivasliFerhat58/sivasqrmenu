import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractSubdomainFromHost } from '@/lib/subdomain'
import { logger } from '@/lib/logger'

// Routes that should not be affected by subdomain routing
const EXCLUDED_PATHS = [
  '/api',
  '/_next',
  '/favicon.ico',
  '/uploads',
  '/auth',
  '/dashboard',
  '/admin',
]

// Helper to check if path is a dynamic subdomain route
function isSubdomainRoute(pathname: string): boolean {
  // Check if pathname matches pattern like /restoran1 (single segment, no extension)
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length === 1 && /^[a-z0-9-]+$/.test(parts[0]) && !parts[0].includes('.')) {
    return true
  }
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for excluded paths
  if (EXCLUDED_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const host = request.headers.get('host') || ''
  const baseDomain = process.env.BASE_DOMAIN || 'localhost:3000'
  const isDevelopment = process.env.NODE_ENV === 'development' || baseDomain.includes('localhost')

  let subdomain: string | null = null

  // In development, support path-based routing: /restoran1
  // In production, use subdomain routing: restoran1.example.com
  if (isDevelopment && isSubdomainRoute(pathname)) {
    const pathParts = pathname.split('/').filter(Boolean)
    if (pathParts.length > 0) {
      subdomain = pathParts[0]
    }
  }

  // If no subdomain from path, try extracting from host header
  if (!subdomain) {
    subdomain = extractSubdomainFromHost(host, baseDomain)
  }

  // If no subdomain, continue to main app (dashboard, auth, etc.)
  if (!subdomain) {
    return NextResponse.next()
  }

  // Validate subdomain format
  if (!/^[a-z0-9-]+$/.test(subdomain)) {
    logger.warn('[Middleware] Invalid subdomain format:', subdomain)
    return NextResponse.rewrite(new URL('/404', request.url))
  }

  try {
    logger.debug('[Middleware] Looking for restaurant with subdomain:', subdomain)
    
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
      logger.warn('[Middleware] Restaurant not found for subdomain:', subdomain)
      // In development, list all restaurants for debugging
      if (process.env.NODE_ENV === 'development') {
        const allRestaurants = await prisma.restaurant.findMany({
          select: { subdomain: true, name: true },
        })
        logger.debug('[Middleware] Available restaurants:', allRestaurants)
      }
      // Let Next.js handle 404 with not-found.tsx
      return NextResponse.next()
    }
    
    logger.debug('[Middleware] Restaurant found:', restaurant.name, 'subdomain:', restaurant.subdomain)

    if (!restaurant.isActive) {
      return NextResponse.rewrite(new URL('/inactive', request.url))
    }

    // Add restaurant data to request headers for use in pages
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-restaurant-id', restaurant.id)
    requestHeaders.set('x-restaurant-subdomain', restaurant.subdomain)
    requestHeaders.set('x-restaurant-name', restaurant.name)

    // Rewrite to the [subdomain] dynamic route
    // This route will read restaurant data from headers
    const url = request.nextUrl.clone()
    // Keep the subdomain in path for the dynamic route
    if (isDevelopment && pathname.startsWith(`/${subdomain}`)) {
      // Already has subdomain in path, keep it
      url.pathname = pathname
    } else {
      // Production or first time, add subdomain to path
      url.pathname = `/${subdomain}`
    }
    
    const response = NextResponse.rewrite(url, {
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
    logger.error('Middleware error:', error)
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

