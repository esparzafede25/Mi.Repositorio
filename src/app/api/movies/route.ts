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
    const genre = searchParams.get("genre")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const director = searchParams.get("director")?.trim() || "";
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined;
    const favorite = searchParams.get("favorite");
    const markedMe = searchParams.get("markedMe");
    const rewatch = searchParams.get("rewatch");
    const tag = searchParams.get("tag")?.trim() || "";
    const sort = searchParams.get("sort") || "recent";

    const whereClause: any = {
      userId: user.id,
    };

    if (q) {
      whereClause.OR = [
        { title: { contains: q } },
        { originalTitle: { contains: q } },
        { director: { contains: q } },
        { genres: { contains: q } },
        { tags: { contains: q } },
        { location: { contains: q } },
      ];
    }

    if (genre) {
      whereClause.genres = { contains: genre };
    }

    if (tag) {
      whereClause.tags = { contains: tag };
    }

    if (status) {
      whereClause.status = status;
    }

    if (director) {
      whereClause.director = { contains: director };
    }

    if (year) {
      whereClause.year = year;
    }

    if (favorite === "true") {
      whereClause.isFavorite = true;
    }

    if (markedMe === "true") {
      whereClause.markedMe = true;
    }

    if (rewatch === "true") {
      whereClause.rewatch = true;
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "oldest") orderBy = { createdAt: "asc" };
    if (sort === "az") orderBy = { title: "asc" };
    if (sort === "za") orderBy = { title: "desc" };
    if (sort === "rating_desc") orderBy = { rating: "desc" };
    if (sort === "year_desc") orderBy = { year: "desc" };
    if (sort === "favorite_order") orderBy = [{ favoriteOrder: "asc" }, { rating: "desc" }];

    const movies = await prisma.movie.findMany({
      where: whereClause,
      orderBy,
      include: {
        moments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json({ movies });
  } catch (error) {
    console.error("Error al obtener películas:", error);
    return NextResponse.json({ error: "Error al obtener películas" }, { status: 500 });
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
      originalTitle,
      year,
      director,
      genres,
      posterUrl,
      watchedDate,
      rating,
      status = "Vista",
      notes,
      review,
      tags,
      isFavorite = false,
      markedMe = false,
      rewatch = false,
      favoriteOrder,
      personalPhotos,
      location,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "El título de la película es obligatorio." }, { status: 400 });
    }

    const movie = await prisma.movie.create({
      data: {
        userId: user.id,
        title: title.trim(),
        originalTitle: originalTitle?.trim() || null,
        year: year ? parseInt(year) : null,
        director: director?.trim() || null,
        genres: genres?.trim() || null,
        posterUrl: posterUrl?.trim() || null,
        watchedDate: watchedDate ? new Date(watchedDate) : null,
        rating: rating !== undefined && rating !== null ? parseFloat(rating) : null,
        status: status || "Vista",
        notes: notes?.trim() || null,
        review: review?.trim() || null,
        tags: tags?.trim() || null,
        isFavorite: Boolean(isFavorite),
        markedMe: Boolean(markedMe),
        rewatch: Boolean(rewatch),
        favoriteOrder: favoriteOrder ? parseInt(favoriteOrder) : null,
        personalPhotos: personalPhotos || null,
        location: location?.trim() || null,
      },
    });

    // Registrar actividad en la biografía cultural
    await prisma.activity.create({
      data: {
        userId: user.id,
        entityType: "movie",
        entityId: movie.id,
        action: "Agregaste",
        title: movie.title,
      },
    });

    return NextResponse.json({
      success: true,
      movie,
      message: "Película guardada correctamente.",
    });
  } catch (error) {
    console.error("Error al crear película:", error);
    return NextResponse.json({ error: "Error al guardar la película" }, { status: 500 });
  }
}
