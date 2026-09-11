import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");
    const videogameId = searchParams.get("videogameId");
    const bookId = searchParams.get("bookId");
    const q = searchParams.get("q")?.trim() || "";

    const whereClause: any = {
      userId: user.id,
    };

    if (movieId) whereClause.movieId = movieId;
    if (videogameId) whereClause.videogameId = videogameId;
    if (bookId) whereClause.bookId = bookId;

    if (q) {
      whereClause.OR = [
        { title: { contains: q } },
        { content: { contains: q } },
        { location: { contains: q } },
        { sharedWith: { contains: q } },
      ];
    }

    const moments = await prisma.moment.findMany({
      where: whereClause,
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      include: {
        movie: {
          select: { id: true, title: true, posterUrl: true, year: true },
        },
        videogame: {
          select: { id: true, title: true, coverUrl: true, year: true, platform: true },
        },
        book: {
          select: { id: true, title: true, coverUrl: true, year: true, author: true },
        },
      },
    });

    return NextResponse.json({ moments });
  } catch (error) {
    console.error("Error al obtener momentos:", error);
    return NextResponse.json({ error: "Error al obtener momentos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
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

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "El título del recuerdo es obligatorio." }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "El texto o memoria del recuerdo es obligatorio." }, { status: 400 });
    }

    const moment = await prisma.moment.create({
      data: {
        userId: user.id,
        title: title.trim(),
        content: content.trim(),
        date: date ? new Date(date) : new Date(),
        location: location?.trim() || null,
        sharedWith: sharedWith?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        movieId: movieId || null,
        videogameId: videogameId || null,
        bookId: bookId || null,
      },
      include: {
        movie: { select: { id: true, title: true, posterUrl: true, year: true } },
        videogame: { select: { id: true, title: true, coverUrl: true, year: true, platform: true } },
        book: { select: { id: true, title: true, coverUrl: true, year: true, author: true } },
      },
    });

    await prisma.activity.create({
      data: {
        userId: user.id,
        entityType: "moment",
        entityId: moment.id,
        action: "Registraste un momento",
        title: moment.title,
      },
    });

    return NextResponse.json({
      success: true,
      moment,
      message: "Momento guardado en tu biografía cultural.",
    });
  } catch (error) {
    console.error("Error al crear momento:", error);
    return NextResponse.json({ error: "Error al registrar momento" }, { status: 500 });
  }
}
