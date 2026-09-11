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

    const list = await prisma.customList.findFirst({
      where: { id, userId: user.id },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!list) {
      return NextResponse.json({ error: "Lista no encontrada." }, { status: 404 });
    }

    const itemsWithDetails = await Promise.all(
      list.items.map(async (item) => {
        let entityData = null;
        if (item.entityType === "movie") {
          entityData = await prisma.movie.findUnique({ where: { id: item.entityId } });
          return { ...item, movie: entityData };
        } else if (item.entityType === "videogame") {
          entityData = await prisma.videogame.findUnique({ where: { id: item.entityId } });
          return { ...item, videogame: entityData };
        } else if (item.entityType === "book") {
          entityData = await prisma.book.findUnique({ where: { id: item.entityId } });
          return { ...item, book: entityData };
        }
        return item;
      })
    );

    return NextResponse.json({ list: { ...list, items: itemsWithDetails } });
  } catch (error) {
    console.error("Error al obtener lista:", error);
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
    const existing = await prisma.customList.findFirst({
      where: { id, userId: user.id },
      include: { items: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Lista no encontrada." }, { status: 404 });
    }

    const body = await request.json();

    // Acciones específicas de items
    if (body.action === "add_item") {
      const { entityType, entityId } = body;
      if (!entityType || !entityId) {
        return NextResponse.json({ error: "Tipo y ID de elemento requeridos." }, { status: 400 });
      }

      // Check if already in list
      const alreadyInList = existing.items.some(
        (i) => i.entityType === entityType && i.entityId === entityId
      );

      if (alreadyInList) {
        return NextResponse.json({ error: "El elemento ya está en esta lista." }, { status: 400 });
      }

      const nextOrder = existing.items.length;
      await prisma.customListItem.create({
        data: {
          listId: id,
          entityType,
          entityId,
          order: nextOrder,
        },
      });

      return NextResponse.json({ success: true, message: "Elemento agregado a la lista ✓" });
    }

    if (body.action === "remove_item") {
      const { itemId } = body;
      await prisma.customListItem.deleteMany({
        where: { id: itemId, listId: id },
      });
      return NextResponse.json({ success: true, message: "Elemento quitado de la lista." });
    }

    // Actualización de datos de la lista
    const { name, description, color } = body;
    const updated = await prisma.customList.update({
      where: { id },
      data: {
        name: name?.trim() || existing.name,
        description: description !== undefined ? description?.trim() || null : existing.description,
        color: color || existing.color,
      },
    });

    return NextResponse.json({
      success: true,
      list: updated,
      message: "Lista actualizada correctamente.",
    });
  } catch (error) {
    console.error("Error al actualizar lista:", error);
    return NextResponse.json({ error: "Error al actualizar lista" }, { status: 500 });
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

    const existing = await prisma.customList.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Lista no encontrada." }, { status: 404 });
    }

    await prisma.customList.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Lista eliminada correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar lista:", error);
    return NextResponse.json({ error: "Error al eliminar lista" }, { status: 500 });
  }
}
