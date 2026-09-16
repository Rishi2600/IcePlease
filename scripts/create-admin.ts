/**
 * Creates or promotes an admin user.
 *
 * `prisma/seed.ts` is for development only — it writes demo products and a
 * password that is published in the README. Production needs a way to get a
 * first real admin without any of that, which is what this is.
 *
 * Usage:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='...' npm run create-admin
 *
 * Point DATABASE_URL at the target database. Existing users with that email
 * are promoted to ADMIN and their password reset, so this doubles as password
 * recovery for a locked-out admin.
 */
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const MIN_PASSWORD_LENGTH = 12;

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "IcePlease Admin";

  if (!email || !password) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD.\n" +
        "  ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='...' npm run create-admin",
    );
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new Error(`"${email}" is not a valid email address.`);
  }

  // Longer than the 8 the public signup form allows: this account can edit
  // prices and read every customer's details.
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true },
  });

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: Role.ADMIN, passwordHash },
    create: { email, name, role: Role.ADMIN, passwordHash },
    select: { email: true, role: true },
  });

  console.log(
    existing
      ? `Updated ${user.email} — role ${user.role}, password reset.`
      : `Created ${user.email} — role ${user.role}.`,
  );
  console.log("Sign in at /login.");
}

main()
  .catch((error: unknown) => {
    console.error(
      `\n${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
