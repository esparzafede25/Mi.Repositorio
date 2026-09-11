import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { TimelineMilestone } from "@/lib/types";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const [movies, games, books, moments] = await Promise.all([
      prisma.movie.findMany({ where: { userId: user.id } }),
      prisma.videogame.findMany({ where: { userId: user.id } }),
      prisma.book.findMany({ where: { userId: user.id } }),
      prisma.moment.findMany({
        where: { userId: user.id },
        include: { movie: true, videogame: true, book: true },
      }),
    ]);

    const milestones: TimelineMilestone[] = [];

    // Process movies
    movies.forEach((m) => {
      const dateVal = m.watchedDate || (m.year ? new Date(m.year, 0, 1) : null) || m.createdAt;
      const dateObj = new Date(dateVal);
      const year = m.year || dateObj.getFullYear();
      const decade = `${Math.floor(year / 10) * 10}s`;

      milestones.push({
        id: m.id,
        type: "movie",
        title: m.title,
        subtitle: m.director ? `Dir. ${m.director}` : null,
        dateStr: dateObj.toISOString(),
        year,
        decade,
        image: m.posterUrl,
        rating: m.rating,
        tags: m.tags,
        notes: m.notes || m.review,
        isFavorite: m.isFavorite,
        markedMe: m.markedMe,
        location: m.location,
      });
    });

    // Process videogames
    games.forEach((g) => {
      const dateVal = g.playedDate || (g.year ? new Date(g.year, 0, 1) : null) || g.createdAt;
      const dateObj = new Date(dateVal);
      const year = g.year || dateObj.getFullYear();
      const decade = `${Math.floor(year / 10) * 10}s`;

      milestones.push({
        id: g.id,
        type: "videogame",
        title: g.title,
        subtitle: g.platform ? `${g.platform}` : (g.developer ? `Dev. ${g.developer}` : null),
        dateStr: dateObj.toISOString(),
        year,
        decade,
        image: g.coverUrl,
        rating: g.rating,
        tags: g.tags,
        notes: g.notes || g.review,
        isFavorite: g.isFavorite,
        markedMe: g.markedMe,
        location: g.location,
      });
    });

    // Process books
    books.forEach((b) => {
      const dateVal = b.readDate || (b.year ? new Date(b.year, 0, 1) : null) || b.createdAt;
      const dateObj = new Date(dateVal);
      const year = b.year || dateObj.getFullYear();
      const decade = `${Math.floor(year / 10) * 10}s`;

      milestones.push({
        id: b.id,
        type: "book",
        title: b.title,
        subtitle: b.author ? `Por ${b.author}` : null,
        dateStr: dateObj.toISOString(),
        year,
        decade,
        image: b.coverUrl,
        rating: b.rating,
        tags: b.tags,
        notes: b.notes || b.review,
        isFavorite: b.isFavorite,
        markedMe: b.markedMe,
        location: b.location,
      });
    });

    // Process moments
    moments.forEach((mo) => {
      const dateVal = mo.date || mo.createdAt;
      const dateObj = new Date(dateVal);
      const year = dateObj.getFullYear();
      const decade = `${Math.floor(year / 10) * 10}s`;

      milestones.push({
        id: mo.id,
        type: "moment",
        title: mo.title,
        subtitle: mo.movie?.title
          ? `Momento con 🎬 ${mo.movie.title}`
          : mo.videogame?.title
          ? `Momento con 🎮 ${mo.videogame.title}`
          : mo.book?.title
          ? `Momento con 📚 ${mo.book.title}`
          : null,
        dateStr: dateObj.toISOString(),
        year,
        decade,
        image: mo.imageUrl || mo.movie?.posterUrl || mo.videogame?.coverUrl || mo.book?.coverUrl,
        notes: mo.content,
        location: mo.location,
        sharedWith: mo.sharedWith,
      });
    });

    // Sort descending by date
    milestones.sort((a, b) => new Date(b.dateStr).getTime() - new Date(a.dateStr).getTime());

    // Extract available years and decades
    const years = Array.from(new Set(milestones.map((m) => m.year))).sort((a, b) => b - a);
    const decades = Array.from(new Set(milestones.map((m) => m.decade))).sort((a, b) => (b > a ? 1 : -1));

    return NextResponse.json({
      milestones,
      years,
      decades,
      totalCount: milestones.length,
    });
  } catch (error) {
    console.error("Error al obtener timeline:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
