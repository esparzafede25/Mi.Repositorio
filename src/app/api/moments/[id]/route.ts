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

    const moment = await prisma.moment.findFirst({
      where: { id, userId: user.id },
      include: {
        movie: true,
        videogame: true,
        book: true,
      },
    });

    if (!moment) {
      return NextResponse.json({ error: "Momento no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ moment });
  } catch (error) {
    console.error("Error al obtener momento:", error);
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
    const existing = await prisma.moment.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Momento no encontrado." }, { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      content,
      date,
      location,
      sharedWith,
      imageUrl,
      movieId,
      videogameId,
      bookId,
    } = body;

    const updated = await prisma.moment.update({
      where: { id },
      data: {
        title: title?.trim() || existing.title,
        content: content?.trim() || existing.content,
        date: date !== undefined ? (date ? new Date(date) : null) : existing.date,
        location: location !== undefined ? location?.trim() || null : existing.location,
        sharedWith: sharedWith !== undefined ? sharedWith?.trim() || null : existing.sharedWith,
        imageUrl: imageUrl !== undefined ? imageUrl?.trim() || null : existing.imageUrl,
        movieId: movieId !== undefined ? movieId || null : existing.movieId,
        videogameId: videogameId !== undefined ? videogameId || null : existing.videogameId,
        bookId: bookId !== undefined ? bookId || null : existing.bookId,
      },
      include: {
        movie: { select: { id: true, title: true, posterUrl: true, year: true } },
        videogame: { select: { id: true, title: true, coverUrl: true, year: true, platform: true } },
        book: { select: { id: true, title: true, coverUrl: true, year: true, author: true } },
      },
    });

    return NextResponse.json({
      success: true,
      moment: updated,
      message: "Momento actualizado correctamente.",
    });
  } catch (error) {
    console.error("Error al actualizar momento:", error);
    return NextResponse.json({ error: "Error al actualizar momento" }, { status: 500 });
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

    const existing = await prisma.moment.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Momento no encontrado." }, { status: 404 });
    }

    await prisma.moment.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Momento eliminado correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar momento:", error);
    return NextResponse.json({ error: "Error al eliminar momento" }, { status: 500 });
  }
}
