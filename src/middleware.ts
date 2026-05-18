import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  '/api/dev-login(.*)'
])

export default clerkMiddleware(async (auth, request) => {
  // Check for our dev bypass cookie
  const devSession = request.cookies.get('dev_session');
  
  if (devSession && devSession.value) {
    // If they have the dev cookie, they're allowed through public or private routes
    // But since clerk doesn't know about them, we need to handle auth differently in our components
    return NextResponse.next();
  }

  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
