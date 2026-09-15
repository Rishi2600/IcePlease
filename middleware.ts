import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

/**
 * First line of defence for /admin and /account.
 *
 * Signed out goes to sign-in with a callback; signed in but not an admin goes
 * to the homepage rather than to sign-in, which would only bounce them back to
 * their account and look like a loop.
 *
 * This is not the only line of defence. Every admin page re-checks the session
 * server-side and every admin mutation calls `requireAdminAction`, because
 * middleware cannot protect a server action invoked directly.
 */
export default withAuth(
  function middleware(request) {
    const token = request.nextauth.token;
    const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

    if (isAdminRoute && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Anything unauthenticated is sent to sign-in by next-auth itself.
      authorized: ({ token }) => Boolean(token),
    },
    pages: { signIn: "/login" },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
