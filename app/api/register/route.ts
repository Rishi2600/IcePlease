import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("Email already in use", { status: 409 }); // 409 Conflict
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    // Do not return the password hash
    const { hashedPassword: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 }); // 201 Created
  } catch (error) {
    console.error("[REGISTER_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}