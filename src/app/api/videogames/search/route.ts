import { NextResponse } from "next/server";

interface GameEntry {
  id: string;
  title: string;
  platform: string;
  year: number;
  developer: string;
  genres: string;
  coverUrl: string;
  description: string;
}

const GAME_CATALOG: GameEntry[] = [
  {
    id: "zelda-botw",
    title: "The Legend of Zelda: Breath of the Wild",
    platform: "Nintendo Switch",
    year: 2017,
    developer: "Nintendo EPD",
    genres: "Acción, Aventura, Mundo Abierto",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co3p2d.png",
    description: "Una aventura en un mundo abierto masivo donde Link despierta tras un letargo de 100 años para salvar el reino de Hyrule.",
  },
  {
    id: "zelda-oot",
    title: "The Legend of Zelda: Ocarina of Time",
    platform: "Nintendo 64",
    year: 1998,
    developer: "Nintendo EAD",
    genres: "Aventura, Fantasía",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5vmg.png",
    description: "Una obra maestra pionera del 3D donde Link viaja a través del tiempo para evitar que Ganondorf se apodere de la Trifuerza.",
  },
  {
    id: "super-mario-64",
    title: "Super Mario 64",
    platform: "Nintendo 64",
    year: 1996,
    developer: "Nintendo EAD",
    genres: "Plataformas 3D",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.png",
    description: "El juego que definió el movimiento y la cámara en entornos 3D en el castillo de la Princesa Peach.",
  },
  {
    id: "super-mario-odyssey",
    title: "Super Mario Odyssey",
    platform: "Nintendo Switch",
    year: 2017,
    developer: "Nintendo EPD",
    genres: "Plataformas, Sandbox",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1m59.png",
    description: "Mario viaja a través de múltiples reinos del globo terráqueo acompañado de Cappy.",
  },
  {
    id: "chrono-trigger",
    title: "Chrono Trigger",
    platform: "SNES",
    year: 1995,
    developer: "Square",
    genres: "JRPG, Viajes en el Tiempo",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1pcy.png",
    description: "JRPG legendario con diseño de personajes de Akira Toriyama y música de Yasunori Mitsuda.",
  },
  {
    id: "final-fantasy-vii",
    title: "Final Fantasy VII",
    platform: "PlayStation",
    year: 1997,
    developer: "Square",
    genres: "JRPG, Ciencia Ficción",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co20wa.png",
    description: "Cloud Strife y AVALANCHA luchan contra la corporación Shinra y el enigmático Sephiroth.",
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    platform: "PC, PS5, Xbox Series X",
    year: 2022,
    developer: "FromSoftware",
    genres: "Acción RPG, Souls-like",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.png",
    description: "En las Tierras Intermedias gobernadas por la Reina Márika la Eterna, el Círculo de Elden ha sido destruido.",
  },
  {
    id: "dark-souls",
    title: "Dark Souls",
    platform: "PC, PS3, Xbox 360",
    year: 2011,
    developer: "FromSoftware",
    genres: "Acción RPG, Dark Fantasy",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1x4d.png",
    description: "El clásico que consolidó el género Souls en el decadente reino de Lordran.",
  },
  {
    id: "bloodborne",
    title: "Bloodborne",
    platform: "PlayStation 4",
    year: 2015,
    developer: "FromSoftware",
    genres: "Acción RPG, Terror Cósmico",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7f.png",
    description: "En la ciudad gótica y en ruinas de Yharnam, una terrible plaga transforma a sus habitantes en bestias salvajes.",
  },
  {
    id: "rdr2",
    title: "Red Dead Redemption 2",
    platform: "PC, PS4, Xbox One",
    year: 2018,
    developer: "Rockstar Games",
    genres: "Acción, Western, Mundo Abierto",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.png",
    description: "La épica historia de Arthur Morgan y la banda de forajidos de Van der Linde al final de la era del Salvaje Oeste.",
  },
  {
    id: "gta-v",
    title: "Grand Theft Auto V",
    platform: "PC, PS5, Xbox Series X",
    year: 2013,
    developer: "Rockstar North",
    genres: "Acción, Crimen, Sandbox",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.png",
    description: "Los Santos: una metrópolis saturada de falsos gurús, aspirantes a estrellas y delincuentes.",
  },
  {
    id: "the-witcher-3",
    title: "The Witcher 3: Wild Hunt",
    platform: "PC, PS4, Xbox One, Switch",
    year: 2015,
    developer: "CD Projekt RED",
    genres: "RPG, Fantasía Oscura",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.png",
    description: "Geralt de Rivia emprende un viaje para encontrar a Ciri, la niña de la profecía, mientras es perseguida por la Cacería Salvaje.",
  },
  {
    id: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    platform: "PC, PS5, Xbox Series X",
    year: 2020,
    developer: "CD Projekt RED",
    genres: "RPG, Sci-Fi, Cyberpunk",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2mvt.png",
    description: "Night City: una megalópolis obsesionada con el poder, el glamur y la modificación corporal.",
  },
  {
    id: "hollow-knight",
    title: "Hollow Knight",
    platform: "PC, Nintendo Switch, PS4",
    year: 2017,
    developer: "Team Cherry",
    genres: "Metroidvania, Acción 2D",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co93ca.png",
    description: "Desciende a las profundidades de Hallownest, un vasto reino subterráneo habitado por insectos y héroes olvidados.",
  },
  {
    id: "half-life-2",
    title: "Half-Life 2",
    platform: "PC",
    year: 2004,
    developer: "Valve",
    genres: "FPS, Ciencia Ficción",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1zco.png",
    description: "Gordon Freeman empuña su emblemática palanca en una Tierra distópica dominada por la Alianza.",
  },
  {
    id: "portal-2",
    title: "Portal 2",
    platform: "PC, PS3, Xbox 360",
    year: 2011,
    developer: "Valve",
    genres: "Puzzles, Comedia, Ciencia Ficción",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rs4.png",
    description: "GLaDOS y Wheatley guían a Chell a través de los desmoronados laboratorios de enriquecimiento de Aperture Science.",
  },
  {
    id: "resident-evil-4",
    title: "Resident Evil 4",
    platform: "PC, GameCube, PS4, PS5",
    year: 2005,
    developer: "Capcom",
    genres: "Survival Horror, Acción",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1nd4.png",
    description: "El agente especial Leon S. Kennedy es enviado a rescatar a la hija secuestrada del presidente en una remota aldea europea.",
  },
  {
    id: "god-of-war-2018",
    title: "God of War",
    platform: "PS4, PC",
    year: 2018,
    developer: "Santa Monica Studio",
    genres: "Acción, Aventura, Mitología Nórdica",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.png",
    description: "Kratos ahora vive en las tierras de los dioses nórdicos y entrena a su hijo Atreus para sobrevivir.",
  },
  {
    id: "minecraft",
    title: "Minecraft",
    platform: "Multiplataforma",
    year: 2011,
    developer: "Mojang Studios",
    genres: "Sandbox, Supervivencia",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co8fv5.png",
    description: "Explora mundos generados aleatoriamente y construye desde casas sencillas hasta imponentes fortalezas.",
  },
  {
    id: "metal-gear-solid",
    title: "Metal Gear Solid",
    platform: "PlayStation",
    year: 1998,
    developer: "Konami",
    genres: "Sigilo, Acción Cinemática",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1x77.png",
    description: "Solid Snake se infiltra en Shadow Moses para neutralizar una amenaza nuclear terrorista.",
  },
  {
    id: "silent-hill-2",
    title: "Silent Hill 2",
    platform: "PlayStation 2, PC",
    year: 2001,
    developer: "Team Silent / Konami",
    genres: "Terror Psicológico",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1x41.png",
    description: "James Sunderland viaja al pueblo cubierto de niebla tras recibir una carta de su esposa fallecida.",
  },
  {
    id: "doom-1993",
    title: "DOOM",
    platform: "PC, Retro",
    year: 1993,
    developer: "id Software",
    genres: "FPS, Acción Clásica",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1y3f.png",
    description: "El legendario shooter en primera persona que revolucionó los videojuegos de acción.",
  },
  {
    id: "mass-effect-2",
    title: "Mass Effect 2",
    platform: "PC, PS3, Xbox 360",
    year: 2010,
    developer: "BioWare",
    genres: "RPG, Ciencia Ficción, Space Opera",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7x.png",
    description: "El Comandante Shepard recluta un equipo de especialistas de élite para una misión suicida en el espacio profundo.",
  },
  {
    id: "the-last-of-us",
    title: "The Last of Us",
    platform: "PlayStation 3, PS4, PS5, PC",
    year: 2013,
    developer: "Naughty Dog",
    genres: "Acción, Aventura, Post-apocalíptico",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r0o.png",
    description: "Joel y Ellie deben cruzar unos Estados Unidos devastados por una infección parasitaria.",
  },
  {
    id: "shadow-of-the-colossus",
    title: "Shadow of the Colossus",
    platform: "PlayStation 2, PS4",
    year: 2005,
    developer: "Team Ico",
    genres: "Aventura, Poesía Interactiva",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1x7p.png",
    description: "Wander debe derrotar a 16 gigantescos colosos en una tierra prohibida para revivir a una doncella.",
  },
  {
    id: "bioshock",
    title: "BioShock",
    platform: "PC, Xbox 360, PS3",
    year: 2007,
    developer: "Irrational Games",
    genres: "FPS, Inmersive Sim, Terror",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r8a.png",
    description: "Descubre la metrópolis submarina distópica de Rapture, nacida del sueño objetivista de Andrew Ryan.",
  },
  {
    id: "metroid-prime",
    title: "Metroid Prime",
    platform: "Nintendo GameCube, Switch",
    year: 2002,
    developer: "Retro Studios",
    genres: "Acción en primera persona, Aventura",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1nd2.png",
    description: "Samus Aran investiga el planeta Tallon IV y los experimentos de los Piratas Espaciales con Phazon.",
  },
  {
    id: "skyrim",
    title: "The Elder Scrolls V: Skyrim",
    platform: "PC, Multiplataforma",
    year: 2011,
    developer: "Bethesda Game Studios",
    genres: "RPG, Fantasía Medieval",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tnw.png",
    description: "Conviértete en el Sangre de Dragón y domina los gritos de los dragones en el norte helado de Tamriel.",
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || !query.trim()) {
      return NextResponse.json({ results: [] });
    }

    const cleanQuery = query.trim().toLowerCase();

    // Search against local curated catalog
    const matchedGames = GAME_CATALOG.filter((game) => {
      return (
        game.title.toLowerCase().includes(cleanQuery) ||
        game.developer.toLowerCase().includes(cleanQuery) ||
        game.platform.toLowerCase().includes(cleanQuery) ||
        game.genres.toLowerCase().includes(cleanQuery)
      );
    });

    // If query didn't match local, generate a dynamic response based on query
    if (matchedGames.length === 0) {
      const formattedTitle = query
        .trim()
        .replace(/\b\w/g, (l) => l.toUpperCase());

      matchedGames.push({
        id: `custom-${Date.now()}`,
        title: formattedTitle,
        platform: "PC / Consolas",
        year: new Date().getFullYear(),
        developer: "Desarrollador Oficial",
        genres: "Acción / Aventura",
        coverUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
        description: `Videojuego ${formattedTitle}. Podés ajustar la plataforma, año, carátula y desarrollador en tu ficha.`,
      });
    }

    return NextResponse.json({ results: matchedGames });
  } catch (error) {
    console.error("Error al buscar videojuegos:", error);
    return NextResponse.json(
      { error: "Error al consultar el catálogo de videojuegos" },
      { status: 500 }
    );
  }
}
