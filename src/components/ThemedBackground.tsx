"use client";

import React from "react";
import { usePathname } from "next/navigation";

// Colección curada de imágenes cinematográficas, videojuegos clásicos y literatura
const BW_CINEMA_IMAGES = [
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80", // Cámara de cine y bobinas
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80", // Butacas de cine clásico
  "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=600&q=80", // Proyector de celuloide vintage
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80", // Sala de cine oscura
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80", // Cuenta regresiva cinematográfica
  "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=600&q=80", // Pantalla de teatro y cine
  "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=600&q=80", // Cine clásico de marquesina
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80", // Tira de negativo 35mm
];

const BW_GAME_IMAGES = [
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80", // Consolas retro y cables
  "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80", // Máquina recreativa arcade
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80", // Mando clásico de videojuegos
  "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=600&q=80", // Game Boy retro portátil
  "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80", // Palancas de arcade y botones
  "https://images.unsplash.com/photo-1612287233207-6a1656f48a1c?auto=format&fit=crop&w=600&q=80", // Consola clásica vintage
  "https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?auto=format&fit=crop&w=600&q=80", // Joystick y cartuchos
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80", // Código y pantalla CRT
];

const BW_BOOK_IMAGES = [
  "https://images.unsplash.com/photo-1507842229451-79b1be8d62ee?auto=format&fit=crop&w=600&q=80", // Estanterías de biblioteca
  "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80", // Páginas de libro abiertas
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80", // Pila de tomos antiguos
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80", // Lectura en biblioteca histórica
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80", // Libros abiertos con texto
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80", // Novelas y literatura clásica
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80", // Pasillo de gran archivo
  "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80", // Libros de lomo empastado
];

// Collage combinado equilibrado: Cine, Videojuegos y Libros
const MIXED_BW_COLLAGE = [
  BW_CINEMA_IMAGES[0], BW_GAME_IMAGES[0], BW_BOOK_IMAGES[0],
  BW_CINEMA_IMAGES[1], BW_GAME_IMAGES[1], BW_BOOK_IMAGES[1],
  BW_CINEMA_IMAGES[2], BW_GAME_IMAGES[2], BW_BOOK_IMAGES[2],
  BW_CINEMA_IMAGES[3], BW_GAME_IMAGES[3], BW_BOOK_IMAGES[3],
  BW_CINEMA_IMAGES[4], BW_GAME_IMAGES[4], BW_BOOK_IMAGES[4],
  BW_CINEMA_IMAGES[5], BW_GAME_IMAGES[5], BW_BOOK_IMAGES[5],
];

export default function ThemedBackground() {
  const pathname = usePathname();

  const isMovies = pathname.startsWith("/peliculas");
  const isGames = pathname.startsWith("/videojuegos");
  const isBooks = pathname.startsWith("/libros");

  // Si está en una temática específica se prioriza esa temática en blanco y negro; en Home, Dashboard y demás páginas se muestra el collage completo de las 3 temáticas en blanco y negro
  let images = MIXED_BW_COLLAGE;
  if (isMovies) images = BW_CINEMA_IMAGES;
  else if (isGames) images = BW_GAME_IMAGES;
  else if (isBooks) images = BW_BOOK_IMAGES;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Moving Collage Columns - Pure B&W Film/Archive Grain */}
      <div className="absolute inset-0 flex justify-around gap-6 opacity-[0.09] sm:opacity-[0.12] transform -rotate-2 scale-110">
        {/* Column 1 - Moving Down */}
        <div className="flex flex-col gap-6 animate-marquee-down">
          {[...images, ...images].map((img, i) => (
            <div
              key={`c1-${i}`}
              className="w-44 sm:w-56 h-64 sm:h-80 rounded-2xl overflow-hidden bg-black/60 border border-white/10 shrink-0 shadow-2xl"
            >
              <img
                src={img}
                alt="Collage cultural"
                className="w-full h-full object-cover grayscale contrast-125 brightness-75 transition-all duration-700"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Column 2 - Moving Up */}
        <div className="hidden sm:flex flex-col gap-6 animate-marquee-up">
          {[...images.slice(2), ...images, ...images.slice(0, 2)].map((img, i) => (
            <div
              key={`c2-${i}`}
              className="w-44 sm:w-56 h-64 sm:h-80 rounded-2xl overflow-hidden bg-black/60 border border-white/10 shrink-0 shadow-2xl"
            >
              <img
                src={img}
                alt="Collage cultural"
                className="w-full h-full object-cover grayscale contrast-125 brightness-75 transition-all duration-700"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Column 3 - Moving Down */}
        <div className="hidden md:flex flex-col gap-6 animate-marquee-down">
          {[...images.slice(4), ...images, ...images.slice(0, 4)].map((img, i) => (
            <div
              key={`c3-${i}`}
              className="w-44 sm:w-56 h-64 sm:h-80 rounded-2xl overflow-hidden bg-black/60 border border-white/10 shrink-0 shadow-2xl"
            >
              <img
                src={img}
                alt="Collage cultural"
                className="w-full h-full object-cover grayscale contrast-125 brightness-75 transition-all duration-700"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Column 4 - Moving Up */}
        <div className="hidden lg:flex flex-col gap-6 animate-marquee-up">
          {[...images.slice(1), ...images, ...images.slice(0, 1)].map((img, i) => (
            <div
              key={`c4-${i}`}
              className="w-44 sm:w-56 h-64 sm:h-80 rounded-2xl overflow-hidden bg-black/60 border border-white/10 shrink-0 shadow-2xl"
            >
              <img
                src={img}
                alt="Collage cultural"
                className="w-full h-full object-cover grayscale contrast-125 brightness-75 transition-all duration-700"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dark Vignette & Radial Overlays for maximum text contrast */}
      <div className="absolute inset-0 bg-[#0a0c10]/88 backdrop-blur-[2px]" />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c10] via-transparent to-[#0a0c10]" />
    </div>
  );
}
