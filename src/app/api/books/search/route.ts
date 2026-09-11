import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || !query.trim()) {
      return NextResponse.json({ results: [] });
    }

    const cleanQuery = query.trim();

    // 1. Fetch from Open Library API
    const openLibUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      cleanQuery
    )}&limit=15`;

    const res = await fetch(openLibUrl, {
      headers: {
        "User-Agent": "MiRepositorioCultural/1.0 (esparza.fede25@gmail.com)",
      },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.docs && Array.isArray(data.docs) && data.docs.length > 0) {
        const results = data.docs.map((doc: any) => {
          const authors = Array.isArray(doc.author_name)
            ? doc.author_name.slice(0, 3).join(", ")
            : doc.author_name || "";

          let coverUrl = "";
          if (doc.cover_i) {
            coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
          }

          const year = doc.first_publish_year || null;

          const genres = Array.isArray(doc.subject)
            ? doc.subject.slice(0, 3).join(", ")
            : "";

          return {
            id: doc.key || Math.random().toString(36).substring(2),
            title: doc.title || "Sin título",
            author: authors,
            year: year,
            genre: genres,
            coverUrl: coverUrl,
            description: doc.first_sentence ? doc.first_sentence[0] : "",
          };
        });

        return NextResponse.json({ results });
      }
    }

    return NextResponse.json({ results: [] });
  } catch (error) {
    console.error("Error al buscar libros:", error);
    return NextResponse.json(
      { error: "Error al consultar el catálogo de libros" },
      { status: 500 }
    );
  }
}
