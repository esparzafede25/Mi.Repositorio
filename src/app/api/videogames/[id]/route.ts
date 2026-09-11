import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await props.params;

    const game = await prisma.videogame.findFirst({
      where: { id, userId: user.id },
    });

    if (!game) {
      return NextResponse.json({ error: "Videojuego no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ videogame: game });
  } catch (error) {
    console.error("Error al obtener videojuego:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await props.params;
    const existing = await prisma.videogame.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Videojuego no encontrado." }, { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      platform,
      year,
      developer,
      genres,
      coverUrl,
      playedDate,
      rating,
      status,
      notes,
      review,
      tags,
    } = body;

    const updated = await prisma.videogame.update({
      where: { id },
      data: {
        title: title?.trim() || existing.title,
        platform: platform !== undefined ? platform?.trim() || null : existing.platform,
        year: year !== undefined ? (year ? parseInt(year) : null) : existing.year,
        developer: developer !== undefined ? developer?.trim() || null : existing.developer,
        genres: genres !== undefined ? genres?.trim() || null : existing.genres,
        coverUrl: coverUrl !== undefined ? coverUrl?.trim() || null : existing.coverUrl,
        playedDate: playedDate !== undefined ? (playedDate ? new Date(playedDate) : null) : existing.playedDate,
        rating: rating !== undefined ? (rating !== null ? parseFloat(rating) : null) : existing.rating,
        status: status || existing.status,
        notes: notes !== undefined ? notes?.trim() || null : existing.notes,
        review: review !== undefined ? review?.trim() || null : existing.review,
        tags: tags !== undefined ? tags?.trim() || null : existing.tags,
      },
    });

    await prisma.activity.create({
      data: {
        userId: user.id,
        entityType: "videogame",
        entityId: id,
        action: "Actualizaste",
        title: updated.title,
      },
    });

    return NextResponse.json({
      success: true,
      videogame: updated,
      message: "Videojuego actualizado correctamente.",
    });
  } catch (error) {
    console.error("Error al actualizar videojuego:", error);
    return NextResponse.json({ error: "Error al actualizar videojuego" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await props.params;

    const existing = await prisma.videogame.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Videojuego no encontrado." }, { status: 404 });
    }

    await prisma.videogame.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Videojuego eliminado correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar videojuego:", error);
    return NextResponse.json({ error: "Error al eliminar videojuego" }, { status: 500 });
  }
}
