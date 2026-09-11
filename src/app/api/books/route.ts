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
    const q = searchParams.get("q")?.trim() || "";
    const author = searchParams.get("author")?.trim() || "";
    const genre = searchParams.get("genre")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const sort = searchParams.get("sort") || "recent";

    const whereClause: any = {
      userId: user.id,
    };

    if (q) {
      whereClause.OR = [
        { title: { contains: q } },
        { author: { contains: q } },
        { genre: { contains: q } },
        { tags: { contains: q } },
      ];
    }

    if (author) {
      whereClause.author = { contains: author };
    }

    if (genre) {
      whereClause.genre = { contains: genre };
    }

    if (status) {
      whereClause.status = status;
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "oldest") orderBy = { createdAt: "asc" };
    if (sort === "az") orderBy = { title: "asc" };
    if (sort === "za") orderBy = { title: "desc" };
    if (sort === "rating_desc") orderBy = { rating: "desc" };
    if (sort === "year_desc") orderBy = { year: "desc" };

    const books = await prisma.book.findMany({
      where: whereClause,
      orderBy,
    });

    return NextResponse.json({ books });
  } catch (error) {
    console.error("Error al obtener libros:", error);
    return NextResponse.json({ error: "Error al obtener libros" }, { status: 500 });
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
      author,
      year,
      genre,
      coverUrl,
      readDate,
      rating,
      status = "Leído",
      notes,
      review,
      tags,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "El título del libro es obligatorio." }, { status: 400 });
    }

    const book = await prisma.book.create({
      data: {
        userId: user.id,
        title: title.trim(),
        author: author?.trim() || null,
        year: year ? parseInt(year) : null,
        genre: genre?.trim() || null,
        coverUrl: coverUrl?.trim() || null,
        readDate: readDate ? new Date(readDate) : null,
        rating: rating !== undefined && rating !== null ? parseFloat(rating) : null,
        status: status || "Leído",
        notes: notes?.trim() || null,
        review: review?.trim() || null,
        tags: tags?.trim() || null,
      },
    });

    // Registrar actividad en la biografía cultural
    await prisma.activity.create({
      data: {
        userId: user.id,
        entityType: "book",
        entityId: book.id,
        action: "Agregaste",
        title: book.title,
      },
    });

    return NextResponse.json({
      success: true,
      book,
      message: "Libro guardado correctamente en tu archivo personal.",
    });
  } catch (error) {
    console.error("Error al guardar libro:", error);
    return NextResponse.json({ error: "Error al guardar libro" }, { status: 500 });
  }
}
