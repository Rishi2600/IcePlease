import { withAuth } from "next-auth/middleware";

/**
 * First line of defence for /admin and /account: it keeps signed-out and
 * non-admin visitors from ever rendering those routes.
 *
 * It is not the only line. Every admin page re-checks the session server-side
 * and every admin mutation calls `requireAdminAction`, because middleware
 * cannot protect a server action invoked directly.
 */
export default withAuth({
  callbacks: {
    authorized({ token, req }) {
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }
      return Boolean(token);
    },
  },
  pages: { signIn: "/login" },
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
