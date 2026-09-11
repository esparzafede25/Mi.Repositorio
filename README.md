# 🏛️ MI REPOSITORIO — Archivo Cultural Personal

Un repositorio vivo para registrar, puntuar y revivir tus **películas**, **videojuegos** y **libros** favoritos con memoria, detalle y estilo.

---

## ✨ Características

- 🎬 **Cinematografía (Películas):** Búsqueda directa integrada con TMDB (The Movie Database), pósters verticales, directores, fecha de visionado, reseñas y puntuación personal.
- 🎮 **Videojuegos:** Carátulas, plataformas (PC, PlayStation, Nintendo Switch, Xbox, Retro), desarrolladores, horas de juego y estados de completitud.
- 📚 **Biblioteca (Libros):** Fichas de lectura, autores, citas favoritas, reflexiones personales y fechas de lectura.
- 🔐 **Autenticación completa:** Registro e inicio de sesión seguros con JWT en cookies HttpOnly y contraseñas hasheadas con bcrypt.
- 📊 **Panel de Control / Dashboard:** Estadísticas en tiempo real, promedios de calificación y actividad reciente.

---

## 🚀 Inicio Rápido (Local)

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

3. **Iniciar la base de datos:**
   ```bash
   npx prisma db push
   ```

4. **Correr el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. Abrir en el navegador: [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tecnologías

- **Next.js 16** (App Router)
- **React 19**
- **Prisma ORM** + SQLite
- **Tailwind CSS v4**
- **Lucide Icons**
