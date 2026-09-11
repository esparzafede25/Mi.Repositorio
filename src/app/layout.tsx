import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { MusicProvider } from "@/context/MusicContext";
import Navbar from "@/components/Navbar";
import ThemedBackground from "@/components/ThemedBackground";

export const metadata: Metadata = {
  title: "MI REPOSITORIO — Archivo Cultural Personal",
  description: "Tu historia también se cuenta con lo que viste, jugaste y leíste. Registrá y preservá tus películas, videojuegos y libros.",
  keywords: ["archivo cultural", "películas", "videojuegos", "libros", "letterboxd", "organizador personal", "biblioteca"],
  authors: [{ name: "Mi Repositorio" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen flex flex-col bg-[#0a0c10] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 relative">
        <AuthProvider>
          <ToastProvider>
            <MusicProvider>
              {/* Dynamic Animated Themed Background */}
              <ThemedBackground />
              <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 flex flex-col">
                  {children}
                </main>
              </div>
            </MusicProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
