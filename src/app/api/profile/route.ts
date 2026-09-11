import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { username, bio, avatar } = body;

    const updateData: any = {};

    if (username && username.trim()) {
      const cleanUsername = username.trim().toLowerCase();
      if (cleanUsername !== user.username) {
        const existing = await prisma.user.findUnique({
          where: { username: cleanUsername },
        });
        if (existing) {
          return NextResponse.json(
            { error: "El nombre de usuario ya está en uso." },
            { status: 400 }
          );
        }
        updateData.username = cleanUsername;
      }
    }

    if (bio !== undefined) {
      updateData.bio = bio?.trim() || null;
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar?.trim() || null;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Perfil actualizado correctamente.",
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return NextResponse.json({ error: "Error al actualizar perfil" }, { status: 500 });
  }
}
