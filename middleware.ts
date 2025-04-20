import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add headers for Torrentio API requests
  if (request.nextUrl.pathname.startsWith('/torrentio')) {
    response.headers.set('Accept', 'application/json')
  }

  // Add headers for Real-Debrid API requests
  if (request.nextUrl.pathname.startsWith('/realdebrid')) {
    response.headers.set('Accept', 'application/json')
  }

  return response
}

export const config = {
  matcher: ['/torrentio/:path*', '/realdebrid/:path*'],
}