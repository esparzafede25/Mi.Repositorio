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
      momentCount,
      listCount,
      allMovies,
      allGames,
      allBooks,
      allMoments,
      recentActivities,
    ] = await Promise.all([
      prisma.movie.count({ where: { userId: user.id } }),
      prisma.videogame.count({ where: { userId: user.id } }),
      prisma.book.count({ where: { userId: user.id } }),
      prisma.moment.count({ where: { userId: user.id } }),
      prisma.customList.count({ where: { userId: user.id } }),
      prisma.movie.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
      prisma.videogame.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
      prisma.book.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
      prisma.moment.findMany({
        where: { userId: user.id },
        orderBy: { date: "desc" },
        take: 5,
        include: { movie: true, videogame: true, book: true },
      }),
      prisma.activity.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    // Ratings calculation
    const allRatings = [
      ...allMovies.map((m) => m.rating).filter((r): r is number => r !== null && r !== undefined),
      ...allGames.map((g) => g.rating).filter((r): r is number => r !== null && r !== undefined),
      ...allBooks.map((b) => b.rating).filter((r): r is number => r !== null && r !== undefined),
    ];
    const averageRating =
      allRatings.length > 0
        ? Number((allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1))
        : 0;

    // Counts for favorites and marked
    const favoriteCount =
      allMovies.filter((m) => m.isFavorite).length +
      allGames.filter((g) => g.isFavorite).length +
      allBooks.filter((b) => b.isFavorite).length;

    const markedCount =
      allMovies.filter((m) => m.markedMe).length +
      allGames.filter((g) => g.markedMe).length +
      allBooks.filter((b) => b.markedMe).length;

    // Marked items
    const markedItems = [
      ...allMovies.filter((m) => m.markedMe).map((m) => ({ ...m, itemType: "movie" })),
      ...allGames.filter((g) => g.markedMe).map((g) => ({ ...g, itemType: "videogame" })),
      ...allBooks.filter((b) => b.markedMe).map((b) => ({ ...b, itemType: "book" })),
    ];

    // Rewatch items
    const rewatchItems = [
      ...allMovies.filter((m) => m.rewatch).map((m) => ({ ...m, itemType: "movie" })),
      ...allGames.filter((g) => g.rewatch).map((g) => ({ ...g, itemType: "videogame" })),
      ...allBooks.filter((b) => b.rewatch).map((b) => ({ ...b, itemType: "book" })),
    ];

    // Helper for frequencies
    const countFrequencies = (arr: (string | null | undefined)[]) => {
      const counts: Record<string, number> = {};
      arr.forEach((item) => {
        if (!item) return;
        item.split(",").forEach((sub) => {
          const trimmed = sub.trim();
          if (trimmed) counts[trimmed] = (counts[trimmed] || 0) + 1;
        });
      });
      return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    };

    const movieGenres = countFrequencies(allMovies.map((m) => m.genres));
    const movieDirectors = countFrequencies(allMovies.map((m) => m.director));
    const gamePlatforms = countFrequencies(allGames.map((g) => g.platform));
    const gameGenres = countFrequencies(allGames.map((g) => g.genres));
    const bookAuthors = countFrequencies(allBooks.map((b) => b.author));
    const bookGenres = countFrequencies(allBooks.map((b) => b.genre));

    // "Hoy hace..." - Anniversary calculation from real data
    const today = new Date();
    const currentYear = today.getFullYear();
    const todayHistory: any[] = [];

    const checkAnniversary = (dateVal: Date | string | null, type: string, title: string, rating?: number | null, status?: string | null) => {
      if (!dateVal) return;
      const d = new Date(dateVal);
      const diffYears = currentYear - d.getFullYear();
      if (diffYears >= 1) {
        // Match day & month or close within 7 days
        const isSameDayMonth = d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
        if (isSameDayMonth || todayHistory.length < 3) {
          todayHistory.push({
            yearsAgo: diffYears,
            type,
            title,
            rating,
            status,
            date: d.toISOString(),
          });
        }
      }
    };

    allMovies.forEach((m) => checkAnniversary(m.watchedDate || m.createdAt, "movie", m.title, m.rating, m.status));
    allGames.forEach((g) => checkAnniversary(g.playedDate || g.createdAt, "videogame", g.title, g.rating, g.status));
    allBooks.forEach((b) => checkAnniversary(b.readDate || b.createdAt, "book", b.title, b.rating, b.status));

    // Cultural Profile narrative generation
    const topMovieGenre = movieGenres[0]?.name || "el cine clásico";
    const secondMovieGenre = movieGenres[1]?.name || "las narrativas profundas";
    const topPlatform = gamePlatforms[0]?.name || "consolas clásicas";
    const topBookGenre = bookGenres[0]?.name || "la literatura de autor";
    const topAuthor = bookAuthors[0]?.name;

    let culturalProfile = `Tu perfil cultural revela una marcada afinidad con ${topMovieGenre.toLowerCase()}${
      movieGenres[1] ? ` y ${secondMovieGenre.toLowerCase()}` : ""
    }.`;

    if (gamePlatforms.length > 0) {
      culturalProfile += ` En videojuegos, tu ecosistema predilecto se concentra en ${topPlatform}${
        gameGenres[0] ? ` con predilección por títulos de ${gameGenres[0].name.toLowerCase()}` : ""
      }.`;
    }

    if (bookGenres.length > 0 || topAuthor) {
      culturalProfile += ` En el universo literario destacan obras de ${topBookGenre.toLowerCase()}${
        topAuthor ? ` y autores como ${topAuthor}` : ""
      }.`;
    }

    if (markedCount > 0) {
      culturalProfile += ` Has identificado ${markedCount} ${
        markedCount === 1 ? "obra que marcó" : "obras que marcaron"
      } un hito imborrable en tu trayectoria personal.`;
    }

    return NextResponse.json({
      movieCount,
      gameCount,
      bookCount,
      momentCount,
      listCount,
      favoriteCount,
      markedCount,
      averageRating,
      recentActivities,
      recentMovies: allMovies.slice(0, 4),
      recentGames: allGames.slice(0, 4),
      recentBooks: allBooks.slice(0, 4),
      recentMoments: allMoments,
      markedItems: markedItems.slice(0, 8),
      rewatchItems: rewatchItems.slice(0, 8),
      todayHistory: todayHistory.slice(0, 4),
      movieGenres: movieGenres.slice(0, 8),
      movieDirectors: movieDirectors.slice(0, 8),
      gamePlatforms: gamePlatforms.slice(0, 8),
      gameGenres: gameGenres.slice(0, 8),
      bookAuthors: bookAuthors.slice(0, 8),
      bookGenres: bookGenres.slice(0, 8),
      culturalProfile,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return NextResponse.json({ error: "Error al calcular estadísticas" }, { status: 500 });
  }
}
