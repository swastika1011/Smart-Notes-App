import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};



























// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   // Protected routes that require authentication
//   const protectedRoutes = ['/upload', '/dashboard'];
//   const isProtectedRoute = protectedRoutes.some(route => 
//     request.nextUrl.pathname.startsWith(route)
//   );

//   if (isProtectedRoute) {
//     // Check for token in cookies or headers
//     const token = request.cookies.get('token')?.value || 
//                   request.headers.get('authorization')?.replace('Bearer ', '');

//     if (!token) {
//       // Redirect to login if no token found
//       return NextResponse.redirect(new URL('/login', request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/upload/:path*', '/dashboard/:path*'],
// }; 