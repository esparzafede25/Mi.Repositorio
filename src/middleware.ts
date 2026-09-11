import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "mi_repositorio_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "mi-repositorio-cultural-archive-secret-default-key-2025"
);

const protectedRoutes = ["/dashboard", "/peliculas", "/videojuegos", "/libros", "/perfil"];
const authRoutes = ["/login", "/registro"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let isValidSession = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isValidSession = true;
    } catch {
      isValidSession = false;
    }
  }

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  if (isProtected && !isValidSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isValidSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/peliculas/:path*",
    "/videojuegos/:path*",
    "/libros/:path*",
    "/perfil/:path*",
    "/login",
    "/registro",
  ],
};
