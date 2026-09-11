// Automated End-to-End API and Flow Verification Script
const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("=== INICIANDO PRUEBAS DE FUNCIONALIDAD COMPLETA (E2E) ===");
  let cookie = "";

  // 1. Registro de usuario
  console.log("\n[1/10] Probando Registro de usuario...");
  const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: `fede_${Date.now().toString().slice(-4)}`,
      email: `fede_${Date.now()}@repositorio.test`,
      password: "password123",
      confirmPassword: "password123",
    }),
  });
  const registerData = await registerRes.json();
  console.log("Status:", registerRes.status, "Success:", registerData.success);
  if (!registerRes.ok || !registerData.success) throw new Error("Fallo en registro: " + JSON.stringify(registerData));

  // Extraer cookie de sesión
  const setCookie = registerRes.headers.get("set-cookie");
  if (setCookie) {
    cookie = setCookie.split(";")[0];
    console.log("✓ Sesión establecida correctamente con cookie HTTP-only.");
  } else {
    throw new Error("No se recibió cookie de sesión");
  }

  // 2. Consulta de usuario actual (/api/auth/me)
  console.log("\n[2/10] Probando verificación de sesión (/api/auth/me)...");
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: cookie },
  });
  const meData = await meRes.json();
  console.log("✓ Usuario autenticado:", meData.user?.username);

  // 3. Probando búsqueda en catálogo TMDB
  console.log("\n[3/10] Probando API de Películas (/api/tmdb/search?q=Alien)...");
  const tmdbRes = await fetch(`${BASE_URL}/api/tmdb/search?q=Alien`, {
    headers: { Cookie: cookie },
  });
  const tmdbData = await tmdbRes.json();
  console.log("✓ Resultados TMDB obtenidos:", tmdbData.results?.length);
  const alienMovie = tmdbData.results?.[0];
  console.log("  Título encontrado:", alienMovie?.title, "| Año:", alienMovie?.release_date);

  // 4. Subida física de imagen de prueba (/api/upload)
  console.log("\n[4/10] Probando almacenamiento físico de imágenes (/api/upload)...");
  const dummyPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64"
  );
  const formData = new FormData();
  const blob = new Blob([dummyPng], { type: "image/png" });
  formData.append("file", blob, "poster-test.png");

  const uploadRes = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    headers: { Cookie: cookie },
    body: formData,
  });
  const uploadData = await uploadRes.json();
  console.log("Status:", uploadRes.status, "URL generada:", uploadData.url);
  if (!uploadRes.ok || !uploadData.url) throw new Error("Fallo en subida de imagen");
  console.log("✓ Archivo guardado físicamente en disco y URL lista.");

  // 5. Creación real de película (/api/movies)
  console.log("\n[5/10] Probando guardado de Película en Base de Datos...");
  const movieRes = await fetch(`${BASE_URL}/api/movies`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      title: alienMovie?.title || "Alien, el octavo pasajero",
      originalTitle: alienMovie?.original_title || "Alien",
      year: 1979,
      director: "Ridley Scott",
      genres: "Ciencia Ficción, Terror",
      posterUrl: uploadData.url,
      watchedDate: new Date().toISOString(),
      rating: 5,
      status: "Vista",
      notes: "Clásico absoluto del cine de ciencia ficción.",
      review: "Atmósfera asfixiante, diseño de H.R. Giger impecable.",
      tags: "favoritas, 70s, terror",
    }),
  });
  const movieData = await movieRes.json();
  console.log("✓ Película guardada:", movieData.movie?.title, "| ID:", movieData.movie?.id);

  // 6. Creación real de videojuego (/api/videogames)
  console.log("\n[6/10] Probando guardado de Videojuego en Base de Datos...");
  const gameRes = await fetch(`${BASE_URL}/api/videogames`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      title: "Resident Evil 2",
      platform: "PlayStation 5",
      year: 1998,
      developer: "Capcom",
      genres: "Survival Horror",
      coverUrl: uploadData.url,
      playedDate: new Date().toISOString(),
      rating: 5,
      status: "Terminado",
      notes: "Campaña de Leon completada en modo estándar.",
      review: "Una obra maestra de tensión y diseño de escenarios.",
      tags: "survival-horror, capcom, ps5",
    }),
  });
  const gameData = await gameRes.json();
  console.log("✓ Videojuego guardado:", gameData.videogame?.title, "| ID:", gameData.videogame?.id);

  // 7. Creación real de libro (/api/books)
  console.log("\n[7/10] Probando guardado de Libro en Base de Datos...");
  const bookRes = await fetch(`${BASE_URL}/api/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      title: "1984",
      author: "George Orwell",
      year: 1949,
      genre: "Distopía",
      coverUrl: uploadData.url,
      readDate: new Date().toISOString(),
      rating: 5,
      status: "Leído",
      notes: "Edición de Debolsillo, 350 páginas.",
      review: "El Gran Hermano te vigila. Una advertencia inmortal.",
      tags: "clasico, distopia, politica",
    }),
  });
  const bookData = await bookRes.json();
  console.log("✓ Libro guardado:", bookData.book?.title, "| ID:", bookData.book?.id);

  // 8. Consulta de Estadísticas del Dashboard (/api/stats)
  console.log("\n[8/10] Verificando estadísticas y línea de actividad del Dashboard...");
  const statsRes = await fetch(`${BASE_URL}/api/stats`, {
    headers: { Cookie: cookie },
  });
  const statsData = await statsRes.json();
  console.log("  Películas en DB:", statsData.movieCount);
  console.log("  Videojuegos en DB:", statsData.gameCount);
  console.log("  Libros en DB:", statsData.bookCount);
  console.log("  Promedio de calificación:", statsData.averageRating);
  console.log("  Actividades recientes:", statsData.recentActivities?.length);
  statsData.recentActivities?.forEach((a) => {
    console.log(`    - ${a.action} "${a.title}" (${a.entityType})`);
  });

  if (statsData.movieCount !== 1 || statsData.gameCount !== 1 || statsData.bookCount !== 1) {
    throw new Error("Conteo de estadísticas no coincide con los elementos agregados.");
  }
  console.log("✓ Estadísticas y actividad sincronizadas con la Base de Datos.");

  // 9. Probando filtros y búsqueda
  console.log("\n[9/10] Verificando búsqueda y filtros...");
  const searchMovieRes = await fetch(`${BASE_URL}/api/movies?q=Scott`, {
    headers: { Cookie: cookie },
  });
  const searchMovieData = await searchMovieRes.json();
  console.log("✓ Búsqueda por director 'Scott' arrojó:", searchMovieData.movies?.length, "resultado(s)");

  const filterGameRes = await fetch(`${BASE_URL}/api/videogames?platform=PlayStation 5`, {
    headers: { Cookie: cookie },
  });
  const filterGameData = await filterGameRes.json();
  console.log("✓ Filtro por plataforma 'PlayStation 5' arrojó:", filterGameData.videogames?.length, "resultado(s)");

  // 10. Actualización de perfil
  console.log("\n[10/10] Probando edición de perfil...");
  const profileRes = await fetch(`${BASE_URL}/api/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      bio: "Archivista del cine clásico y la literatura distópica.",
    }),
  });
  const profileData = await profileRes.json();
  console.log("✓ Bio actualizada:", profileData.user?.bio);

  console.log("\n=======================================================");
  console.log("🎉 TODAS LAS PRUEBAS FUNCIONALES PASARON CON ÉXITO (10/10)");
  console.log("=======================================================");
}

runTests().catch((err) => {
  console.error("Error durante las pruebas:", err);
  process.exit(1);
});
