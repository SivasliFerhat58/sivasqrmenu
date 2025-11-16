import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { extractSubdomainFromHost } from '@/lib/subdomain'

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
    return NextResponse.rewrite(new URL('/404', request.url))
  }

  // Add subdomain to request headers for use in pages
  // Database lookup will be done in the page component (not in Edge Runtime)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-subdomain', subdomain)

  // Rewrite to the [subdomain] dynamic route
  // This route will read subdomain from headers and do the database lookup
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

  return response
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

