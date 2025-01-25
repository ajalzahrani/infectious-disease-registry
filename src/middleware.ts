import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Lab Doctor can only access patient registration and dashboard
    if (
      token?.role === "LAB_DOCTOR" &&
      !path.match(/^\/($|patients\/register$)/)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Infectious Doctor can access everything except patient registration
    if (
      token?.role === "INFECTIOUS_DOCTOR" &&
      path.match(/^\/patients\/register$/)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Admin can access everything
    if (token?.role === "ADMIN") {
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/patients/:path*",
    "/diseases/:path*",
    "/registry/:path*",
    "/notifications/:path*",
  ],
};
