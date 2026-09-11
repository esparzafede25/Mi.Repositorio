import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import Navbar from "@/components/Navbar";

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
      <body className="min-h-screen flex flex-col bg-[#0a0c10] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
