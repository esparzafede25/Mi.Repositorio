import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await props.params;

    const movie = await prisma.movie.findFirst({
      where: { id, userId: user.id },
      include: {
        moments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!movie) {
      return NextResponse.json({ error: "Película no encontrada." }, { status: 404 });
    }

    return NextResponse.json({ movie });
  } catch (error) {
    console.error("Error al obtener película:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await props.params;
    const existing = await prisma.movie.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Película no encontrada." }, { status: 404 });
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
      status,
      notes,
      review,
      tags,
      isFavorite,
      markedMe,
      rewatch,
      favoriteOrder,
      personalPhotos,
      location,
    } = body;

    const updated = await prisma.movie.update({
      where: { id },
      data: {
        title: title?.trim() || existing.title,
        originalTitle: originalTitle !== undefined ? originalTitle?.trim() || null : existing.originalTitle,
        year: year !== undefined ? (year ? parseInt(year) : null) : existing.year,
        director: director !== undefined ? director?.trim() || null : existing.director,
        genres: genres !== undefined ? genres?.trim() || null : existing.genres,
        posterUrl: posterUrl !== undefined ? posterUrl?.trim() || null : existing.posterUrl,
        watchedDate: watchedDate !== undefined ? (watchedDate ? new Date(watchedDate) : null) : existing.watchedDate,
        rating: rating !== undefined ? (rating !== null ? parseFloat(rating) : null) : existing.rating,
        status: status || existing.status,
        notes: notes !== undefined ? notes?.trim() || null : existing.notes,
        review: review !== undefined ? review?.trim() || null : existing.review,
        tags: tags !== undefined ? tags?.trim() || null : existing.tags,
        isFavorite: isFavorite !== undefined ? Boolean(isFavorite) : existing.isFavorite,
        markedMe: markedMe !== undefined ? Boolean(markedMe) : existing.markedMe,
        rewatch: rewatch !== undefined ? Boolean(rewatch) : existing.rewatch,
        favoriteOrder: favoriteOrder !== undefined ? (favoriteOrder ? parseInt(favoriteOrder) : null) : existing.favoriteOrder,
        personalPhotos: personalPhotos !== undefined ? personalPhotos : existing.personalPhotos,
        location: location !== undefined ? location?.trim() || null : existing.location,
      },
      include: {
        moments: true,
      },
    });

    await prisma.activity.create({
      data: {
        userId: user.id,
        entityType: "movie",
        entityId: id,
        action: "Actualizaste",
        title: updated.title,
      },
    });

    return NextResponse.json({
      success: true,
      movie: updated,
      message: "Película actualizada correctamente.",
    });
  } catch (error) {
    console.error("Error al actualizar película:", error);
    return NextResponse.json({ error: "Error al actualizar película" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await props.params;

    const existing = await prisma.movie.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Película no encontrada." }, { status: 404 });
    }

    await prisma.movie.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Película eliminada correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar película:", error);
    return NextResponse.json({ error: "Error al eliminar película" }, { status: 500 });
  }
}
