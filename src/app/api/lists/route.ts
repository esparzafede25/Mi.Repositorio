import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const lists = await prisma.customList.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
      },
    });

    // Populate actual entity details for each item
    const listsWithDetails = await Promise.all(
      lists.map(async (list) => {
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
        return { ...list, items: itemsWithDetails };
      })
    );

    return NextResponse.json({ lists: listsWithDetails });
  } catch (error) {
    console.error("Error al obtener listas:", error);
    return NextResponse.json({ error: "Error al obtener listas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, color = "#f59e0b" } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "El nombre de la lista es obligatorio." }, { status: 400 });
    }

    const list = await prisma.customList.create({
      data: {
        userId: user.id,
        name: name.trim(),
        description: description?.trim() || null,
        color: color || "#f59e0b",
      },
    });

    await prisma.activity.create({
      data: {
        userId: user.id,
        entityType: "list",
        entityId: list.id,
        action: "Creaste la lista",
        title: list.name,
      },
    });

    return NextResponse.json({
      success: true,
      list: { ...list, items: [] },
      message: "Lista creada correctamente.",
    });
  } catch (error) {
    console.error("Error al crear lista:", error);
    return NextResponse.json({ error: "Error al crear lista" }, { status: 500 });
  }
}
