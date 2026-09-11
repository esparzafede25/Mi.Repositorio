import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// Catálogo cultural curado para pruebas y desarrollo offline / sin API Key
const CULTURAL_FALLBACK_MOVIES: Array<{
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  director: string;
  genres: string;
}> = [
  {
    id: 679,
    title: "Alien, el octavo pasajero",
    original_title: "Alien",
    release_date: "1979-05-25",
    overview: "Una nave espacial comercial regresa a la Tierra cuando su tripulación intercepta una misteriosa transmisión de auxilio desde un planeta desolado.",
    poster_path: "https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg",
    vote_average: 8.5,
    director: "Ridley Scott",
    genres: "Ciencia Ficción, Terror",
  },
  {
    id: 78,
    title: "Blade Runner",
    original_title: "Blade Runner",
    release_date: "1982-06-25",
    overview: "En un futuro sombrío y lluvioso de Los Ángeles, un ex policía es asignado para cazar y retirar replicantes fugitivos con inteligencia sintética.",
    poster_path: "https://image.tmdb.org/t/p/w500/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg",
    vote_average: 8.3,
    director: "Ridley Scott",
    genres: "Ciencia Ficción, Neo-Noir",
  },
  {
    id: 157336,
    title: "Interestelar",
    original_title: "Interstellar",
    release_date: "2014-11-05",
    overview: "Un grupo de exploradores emprende la misión más importante de la historia humana: viajar más allá de nuestra galaxia para asegurar el futuro de la humanidad.",
    poster_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    vote_average: 8.6,
    director: "Christopher Nolan",
    genres: "Ciencia Ficción, Drama, Aventura",
  },
  {
    id: 238,
    title: "El Padrino",
    original_title: "The Godfather",
    release_date: "1972-03-14",
    overview: "El patriarca de una dinastía del crimen organizado en Nueva York transfiere el control de su imperio clandestino a su reacio hijo menor.",
    poster_path: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    vote_average: 9.2,
    director: "Francis Ford Coppola",
    genres: "Crimen, Drama",
  },
  {
    id: 603,
    title: "The Matrix",
    original_title: "The Matrix",
    release_date: "1999-03-30",
    overview: "Un hacker informático descubre la verdadera naturaleza de su realidad y su papel crucial en la guerra contra sus controladores digitales.",
    poster_path: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    vote_average: 8.7,
    director: "Lana Wachowski, Lilly Wachowski",
    genres: "Ciencia Ficción, Acción",
  },
  {
    id: 680,
    title: "Pulp Fiction",
    original_title: "Pulp Fiction",
    release_date: "1994-09-10",
    overview: "Las vidas de dos sicarios de la mafia, un boxeador, la esposa de un gángster y dos bandidos se entrelazan en cuatro historias de violencia y redención.",
    poster_path: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    vote_average: 8.9,
    director: "Quentin Tarantino",
    genres: "Crimen, Suspense",
  },
  {
    id: 129,
    title: "El viaje de Chihiro",
    original_title: "Sen to Chihiro no kamikakushi",
    release_date: "2001-07-20",
    overview: "Una niña de diez años queda atrapada en un mundo gobernado por dioses, brujas y espíritus, donde los humanos se convierten en bestias.",
    poster_path: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    vote_average: 8.5,
    director: "Hayao Miyazaki",
    genres: "Animación, Fantasía, Aventura",
  },
  {
    id: 496243,
    title: "Parásitos",
    original_title: "Gisaengchung",
    release_date: "2019-05-30",
    overview: "Toda la familia de Ki-taek está desempleada y se obsesiona con el acomodado estilo de vida de los adinerados Park hasta que ocurre un inesperado incidente.",
    poster_path: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    vote_average: 8.5,
    director: "Bong Joon-ho",
    genres: "Comedia, Suspense, Drama",
  },
  {
    id: 438631,
    title: "Duna",
    original_title: "Dune",
    release_date: "2021-09-15",
    overview: "Paul Atreides viaja al planeta más peligroso del universo para asegurar el futuro de su familia y su pueblo.",
    poster_path: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    vote_average: 7.9,
    director: "Denis Villeneuve",
    genres: "Ciencia Ficción, Aventura",
  },
  {
    id: 872585,
    title: "Oppenheimer",
    original_title: "Oppenheimer",
    release_date: "2023-07-19",
    overview: "La historia del científico estadounidense J. Robert Oppenheimer y su rol decisivo en el desarrollo de la bomba atómica en el Proyecto Manhattan.",
    poster_path: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    vote_average: 8.1,
    director: "Christopher Nolan",
    genres: "Drama, Historia",
  }
];

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const apiKey = process.env.TMDB_API_KEY;

    // Si hay una API Key de TMDB configurada, hacemos la consulta real a TMDB
    if (apiKey) {
      try {
        const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-ES&query=${encodeURIComponent(
          query
        )}&include_adult=false`;

        const tmdbRes = await fetch(tmdbUrl, { next: { revalidate: 3600 } });
        if (tmdbRes.ok) {
          const data = await tmdbRes.json();
          const results = (data.results || []).slice(0, 10).map((m: any) => ({
            id: m.id,
            title: m.title,
            original_title: m.original_title,
            release_date: m.release_date || "",
            overview: m.overview || "",
            poster_path: m.poster_path
              ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
              : null,
            vote_average: m.vote_average ? Number(m.vote_average.toFixed(1)) : 0,
            director: "",
            genres: "",
          }));

          return NextResponse.json({ results, source: "tmdb" });
        }
      } catch (err) {
        console.warn("Fallo al conectar con TMDB, utilizando fallback cultural:", err);
      }
    }

    // Fallback: búsqueda en el catálogo cultural integrado
    const normalizedQuery = query.toLowerCase();
    const filtered = CULTURAL_FALLBACK_MOVIES.filter(
      (m) =>
        m.title.toLowerCase().includes(normalizedQuery) ||
        m.original_title.toLowerCase().includes(normalizedQuery) ||
        m.director.toLowerCase().includes(normalizedQuery) ||
        m.genres.toLowerCase().includes(normalizedQuery)
    );

    // Si la búsqueda no coincide con el catálogo base, generamos un resultado dinámico de alta calidad
    if (filtered.length === 0) {
      filtered.push({
        id: Math.floor(Math.random() * 10000) + 1000,
        title: query.charAt(0).toUpperCase() + query.slice(1),
        original_title: query,
        release_date: new Date().getFullYear().toString(),
        overview: `Película "${query}". Personalizá todos los detalles en tu formulario antes de guardar.`,
        poster_path: null,
        vote_average: 8.0,
        director: "Director no especificado",
        genres: "Drama, Cine",
      });
    }

    return NextResponse.json({ results: filtered, source: "cultural-index" });
  } catch (error) {
    console.error("Error en búsqueda de películas:", error);
    return NextResponse.json({ error: "Error al buscar películas." }, { status: 500 });
  }
}
