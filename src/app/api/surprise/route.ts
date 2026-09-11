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
    const category = searchParams.get("type") || "all";

    const pool: any[] = [];

    if (category === "movie" || category === "all") {
      const movies = await prisma.movie.findMany({
        where: { userId: user.id },
      });
      movies.forEach((m) => pool.push({ ...m, itemType: "movie" }));
    }

    if (category === "videogame" || category === "all") {
      const games = await prisma.videogame.findMany({
        where: { userId: user.id },
      });
      games.forEach((g) => pool.push({ ...g, itemType: "videogame" }));
    }

    if (category === "book" || category === "all") {
      const books = await prisma.book.findMany({
        where: { userId: user.id },
      });
      books.forEach((b) => pool.push({ ...b, itemType: "book" }));
    }

    if (pool.length === 0) {
      return NextResponse.json({
        found: false,
        message: "Aún no tienes elementos en esta categoría para sorprenderte.",
      });
    }

    // Pick random item
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];

    // Calculate time elapsed
    const refDate = chosen.watchedDate || chosen.playedDate || chosen.readDate || chosen.createdAt;
    const diffMs = Date.now() - new Date(refDate).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    let timeText = "hace poco tiempo";
    if (diffDays >= 365) {
      const years = Math.floor(diffDays / 365);
      timeText = `hace ${years} ${years === 1 ? "año" : "años"}`;
    } else if (diffDays >= 30) {
      const months = Math.floor(diffDays / 30);
      timeText = `hace ${months} ${months === 1 ? "mes" : "meses"}`;
    } else if (diffDays > 0) {
      timeText = `hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`;
    } else {
      timeText = "hoy mismo";
    }

    return NextResponse.json({
      found: true,
      item: chosen,
      timeText,
      totalInPool: pool.length,
    });
  } catch (error) {
    console.error("Error en surprise:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
