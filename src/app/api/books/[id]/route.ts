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

    const book = await prisma.book.findFirst({
      where: { id, userId: user.id },
    });

    if (!book) {
      return NextResponse.json({ error: "Libro no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error("Error al obtener libro:", error);
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
    const existing = await prisma.book.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Libro no encontrado." }, { status: 404 });
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
      status,
      notes,
      review,
      tags,
    } = body;

    const updated = await prisma.book.update({
      where: { id },
      data: {
        title: title?.trim() || existing.title,
        author: author !== undefined ? author?.trim() || null : existing.author,
        year: year !== undefined ? (year ? parseInt(year) : null) : existing.year,
        genre: genre !== undefined ? genre?.trim() || null : existing.genre,
        coverUrl: coverUrl !== undefined ? coverUrl?.trim() || null : existing.coverUrl,
        readDate: readDate !== undefined ? (readDate ? new Date(readDate) : null) : existing.readDate,
        rating: rating !== undefined ? (rating !== null ? parseFloat(rating) : null) : existing.rating,
        status: status || existing.status,
        notes: notes !== undefined ? notes?.trim() || null : existing.notes,
        review: review !== undefined ? review?.trim() || null : existing.review,
        tags: tags !== undefined ? tags?.trim() || null : existing.tags,
      },
    });

    await prisma.activity.create({
      data: {
        userId: user.id,
        entityType: "book",
        entityId: id,
        action: "Actualizaste",
        title: updated.title,
      },
    });

    return NextResponse.json({
      success: true,
      book: updated,
      message: "Libro actualizado correctamente.",
    });
  } catch (error) {
    console.error("Error al actualizar libro:", error);
    return NextResponse.json({ error: "Error al actualizar libro" }, { status: 500 });
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

    const existing = await prisma.book.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Libro no encontrado." }, { status: 404 });
    }

    await prisma.book.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Libro eliminado correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar libro:", error);
    return NextResponse.json({ error: "Error al eliminar libro" }, { status: 500 });
  }
}
