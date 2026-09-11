import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password, remember = true } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Por favor ingresá tu usuario/email y tu contraseña." },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: cleanIdentifier }, { username: cleanIdentifier }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas. Comprobá tu usuario y contraseña." },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Credenciales inválidas. Comprobá tu usuario y contraseña." },
        { status: 401 }
      );
    }

    const token = await createSessionToken(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
      },
      remember
    );

    const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 días o 1 día

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      message: "Sesión iniciada correctamente.",
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return response;
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error interno al iniciar sesión." },
      { status: 500 }
    );
  }
}
