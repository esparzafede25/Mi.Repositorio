import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const [
      movieCount,
      gameCount,
      bookCount,
      recentMovies,
      recentGames,
      recentBooks,
      recentActivities,
      ratedMovies,
      ratedGames,
      ratedBooks,
    ] = await Promise.all([
      prisma.movie.count({ where: { userId: user.id } }),
      prisma.videogame.count({ where: { userId: user.id } }),
      prisma.book.count({ where: { userId: user.id } }),
      prisma.movie.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      prisma.videogame.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      prisma.book.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      prisma.activity.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.movie.findMany({
        where: { userId: user.id, rating: { not: null } },
        select: { rating: true },
      }),
      prisma.videogame.findMany({
        where: { userId: user.id, rating: { not: null } },
        select: { rating: true },
      }),
      prisma.book.findMany({
        where: { userId: user.id, rating: { not: null } },
        select: { rating: true },
      }),
    ]);

    const allRatings = [
      ...ratedMovies.map((m) => m.rating as number),
      ...ratedGames.map((g) => g.rating as number),
      ...ratedBooks.map((b) => b.rating as number),
    ];

    const averageRating =
      allRatings.length > 0
        ? Number((allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1))
        : 0;

    return NextResponse.json({
      movieCount,
      gameCount,
      bookCount,
      averageRating,
      recentActivities,
      recentMovies,
      recentGames,
      recentBooks,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return NextResponse.json({ error: "Error al calcular estadísticas" }, { status: 500 });
  }
}
