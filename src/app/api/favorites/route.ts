import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const [favoriteMovies, favoriteGames, favoriteBooks] = await Promise.all([
      prisma.movie.findMany({
        where: { userId: user.id, isFavorite: true },
        orderBy: [{ favoriteOrder: "asc" }, { rating: "desc" }, { createdAt: "desc" }],
      }),
      prisma.videogame.findMany({
        where: { userId: user.id, isFavorite: true },
        orderBy: [{ favoriteOrder: "asc" }, { rating: "desc" }, { createdAt: "desc" }],
      }),
      prisma.book.findMany({
        where: { userId: user.id, isFavorite: true },
        orderBy: [{ favoriteOrder: "asc" }, { rating: "desc" }, { createdAt: "desc" }],
      }),
    ]);

    return NextResponse.json({
      movies: favoriteMovies,
      videogames: favoriteGames,
      books: favoriteBooks,
    });
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { category, orderedIds } = body;

    if (!category || !Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "Parámetros inválidos." }, { status: 400 });
    }

    // Update order for each id
    if (category === "movie") {
      await Promise.all(
        orderedIds.map((id, index) =>
          prisma.movie.updateMany({
            where: { id, userId: user.id },
            data: { favoriteOrder: index + 1 },
          })
        )
      );
    } else if (category === "videogame") {
      await Promise.all(
        orderedIds.map((id, index) =>
          prisma.videogame.updateMany({
            where: { id, userId: user.id },
            data: { favoriteOrder: index + 1 },
          })
        )
      );
    } else if (category === "book") {
      await Promise.all(
        orderedIds.map((id, index) =>
          prisma.book.updateMany({
            where: { id, userId: user.id },
            data: { favoriteOrder: index + 1 },
          })
        )
      );
    }

    return NextResponse.json({ success: true, message: "Ranking de favoritos actualizado." });
  } catch (error) {
    console.error("Error al ordenar favoritos:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
