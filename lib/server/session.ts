import "server-only";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { authOptions } from "@/lib/auth";

/**
 * Authorization. Every admin page and every admin mutation calls through here.
 *
 * Hiding a link is not authorization, and neither is middleware on its own —
 * these checks run inside the server code that actually touches data.
 */

export type SessionUser = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) return null;
  return {
    id: session.user.id,
    name: session.user.name ?? null,
    email: session.user.email,
    role: session.user.role,
  };
}

export async function isAdmin(): Promise<boolean> {
  const user = await getSessionUser();
  return user?.role === Role.ADMIN;
}

/** For pages: sends an unauthenticated visitor to sign in and returns here. */
export async function requireUser(returnTo: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(`/login?callbackUrl=${encodeURIComponent(returnTo)}`);
  return user;
}

/**
 * For admin pages. A signed-in customer gets a 404 rather than a 403: there is
 * no reason to confirm that an admin area exists at this URL.
 */
export async function requireAdminPage(returnTo: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(`/login?callbackUrl=${encodeURIComponent(returnTo)}`);
  if (user.role !== Role.ADMIN) redirect("/");
  return user;
}

/** Thrown by `requireAdminAction`; server actions convert it to a result. */
export class AuthorizationError extends Error {
  constructor(message = "You are not allowed to do that.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

/** For server actions and route handlers. Throws rather than redirecting. */
export async function requireAdminAction(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (user?.role !== Role.ADMIN) throw new AuthorizationError();
  return user;
}
