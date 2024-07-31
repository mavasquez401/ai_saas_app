import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/api/webhooks/clerk']);

// Make sure that the `/api/webhooks/(.*)` route is not protected here
export default clerkMiddleware((auth, req) => {
  // Restrict admin routes to users with specific permissions
  if (isProtectedRoute(req)) {
    auth().protect((has) => {
      return (
        has({ permission: 'org:sys_memberships:manage' }) ||
        has({ permission: 'org:sys_domains_manage' })
      );
    });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
