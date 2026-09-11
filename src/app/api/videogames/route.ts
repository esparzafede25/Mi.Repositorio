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
    const platform = searchParams.get("platform")?.trim() || "";
    const genre = searchParams.get("genre")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const sort = searchParams.get("sort") || "recent";

    const whereClause: any = {
      userId: user.id,
    };

    if (q) {
      whereClause.OR = [
        { title: { contains: q } },
        { developer: { contains: q } },
        { platform: { contains: q } },
        { genres: { contains: q } },
        { tags: { contains: q } },
      ];
    }

    if (platform) {
      whereClause.platform = { contains: platform };
    }

    if (genre) {
      whereClause.genres = { contains: genre };
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

    const videogames = await prisma.videogame.findMany({
      where: whereClause,
      orderBy,
    });

    return NextResponse.json({ videogames });
  } catch (error) {
    console.error("Error al obtener videojuegos:", error);
    return NextResponse.json({ error: "Error al obtener videojuegos" }, { status: 500 });
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
      platform,
      year,
      developer,
      genres,
      coverUrl,
      playedDate,
      rating,
      status = "Terminado",
      notes,
      review,
      tags,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "El título del videojuego es obligatorio." }, { status: 400 });
    }

    const game = await prisma.videogame.create({
      data: {
        userId: user.id,
        title: title.trim(),
        platform: platform?.trim() || null,
        year: year ? parseInt(year) : null,
        developer: developer?.trim() || null,
        genres: genres?.trim() || null,
        coverUrl: coverUrl?.trim() || null,
        playedDate: playedDate ? new Date(playedDate) : null,
        rating: rating !== undefined && rating !== null ? parseFloat(rating) : null,
        status: status || "Terminado",
        notes: notes?.trim() || null,
        review: review?.trim() || null,
        tags: tags?.trim() || null,
      },
    });

    // Registrar actividad en la biografía cultural
    await prisma.activity.create({
      data: {
        userId: user.id,
        entityType: "videogame",
        entityId: game.id,
        action: "Registraste",
        title: game.title,
      },
    });

    return NextResponse.json({
      success: true,
      videogame: game,
      message: "Videojuego guardado correctamente.",
    });
  } catch (error) {
    console.error("Error al guardar videojuego:", error);
    return NextResponse.json({ error: "Error al guardar videojuego" }, { status: 500 });
  }
}
