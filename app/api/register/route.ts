import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation/auth";
import { fieldErrorsOf } from "@/lib/server/action-result";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Please check the highlighted fields.",
        fieldErrors: fieldErrorsOf(parsed.error),
      },
      { status: 400 },
    );
  }

  const { name, email, phone, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      {
        message: "An account with that email already exists.",
        fieldErrors: { email: "An account with that email already exists." },
      },
      { status: 409 },
    );
  }

  await prisma.user.create({
    data: {
      name,
      email,
      phone: phone || null,
      passwordHash: await bcrypt.hash(password, 12),
      // Role is never taken from the request body. New accounts are customers.
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
