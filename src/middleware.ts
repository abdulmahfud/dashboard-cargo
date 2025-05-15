import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Fungsi untuk memeriksa apakah token valid
async function isTokenValid(token: string) {
  try {
    // Verify token using jose
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );
    const { payload } = await jwtVerify(token, secret);

    // Check if token is expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

// Fungsi untuk memeriksa apakah pengguna sudah login
async function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return false;

  const isValid = await isTokenValid(token);
  if (!isValid) {
    // Clear invalid token
    const response = NextResponse.next();
    response.cookies.delete("token");
    return false;
  }

  return true;
}

// Middleware untuk melindungi rute
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthPath = path === "/login" || path === "/register";
  const isDashboardPath =
    path === "/dashboard" || path.startsWith("/dashboard/");

  // Cek autentikasi
  const authenticated = await isAuthenticated(request);

  // Jika mengakses dashboard tanpa login
  if (isDashboardPath && !authenticated) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Jika sudah login tapi mencoba akses login/signup
  if (isAuthPath && authenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
