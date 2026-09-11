import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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
    const existing = await prisma.journalEntry.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Entrada no encontrada." }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, date, images, movieId, videogameId, bookId } = body;

    const updated = await prisma.journalEntry.update({
      where: { id },
      data: {
        title: title?.trim() || existing.title,
        content: content?.trim() || existing.content,
        date: date !== undefined ? (date ? new Date(date) : new Date()) : existing.date,
        images: images !== undefined ? images : existing.images,
        movieId: movieId !== undefined ? movieId || null : existing.movieId,
        videogameId: videogameId !== undefined ? videogameId || null : existing.videogameId,
        bookId: bookId !== undefined ? bookId || null : existing.bookId,
      },
      include: {
        movie: { select: { id: true, title: true, posterUrl: true, year: true } },
        videogame: { select: { id: true, title: true, coverUrl: true, year: true } },
        book: { select: { id: true, title: true, coverUrl: true, year: true } },
      },
    });

    return NextResponse.json({
      success: true,
      entry: updated,
      message: "Entrada actualizada.",
    });
  } catch (error) {
    console.error("Error al actualizar entrada:", error);
    return NextResponse.json({ error: "Error al actualizar entrada" }, { status: 500 });
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
    const existing = await prisma.journalEntry.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Entrada no encontrada." }, { status: 404 });
    }

    await prisma.journalEntry.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Entrada eliminada correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar entrada:", error);
    return NextResponse.json({ error: "Error al eliminar entrada" }, { status: 500 });
  }
}
