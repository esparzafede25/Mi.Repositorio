import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const entries = await prisma.journalEntry.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      include: {
        movie: { select: { id: true, title: true, posterUrl: true, year: true } },
        videogame: { select: { id: true, title: true, coverUrl: true, year: true } },
        book: { select: { id: true, title: true, coverUrl: true, year: true } },
      },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Error al obtener diario:", error);
    return NextResponse.json({ error: "Error al obtener diario" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, date, images, movieId, videogameId, bookId } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "El título de la entrada es obligatorio." }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "El texto de la entrada es obligatorio." }, { status: 400 });
    }

    const entry = await prisma.journalEntry.create({
      data: {
        userId: user.id,
        title: title.trim(),
        content: content.trim(),
        date: date ? new Date(date) : new Date(),
        images: images || null,
        movieId: movieId || null,
        videogameId: videogameId || null,
        bookId: bookId || null,
      },
      include: {
        movie: { select: { id: true, title: true, posterUrl: true, year: true } },
        videogame: { select: { id: true, title: true, coverUrl: true, year: true } },
        book: { select: { id: true, title: true, coverUrl: true, year: true } },
      },
    });

    await prisma.activity.create({
      data: {
        userId: user.id,
        entityType: "journal",
        entityId: entry.id,
        action: "Escribiste en tu diario",
        title: entry.title,
      },
    });

    return NextResponse.json({
      success: true,
      entry,
      message: "Entrada guardada en tu diario cultural.",
    });
  } catch (error) {
    console.error("Error al guardar entrada de diario:", error);
    return NextResponse.json({ error: "Error al guardar entrada" }, { status: 500 });
  }
}
