import { NextResponse } from "next/server";
import { auth } from "./auth";
import { rolePermissions, publicRoutes } from "@/lib/permissions";

export async function middleware(request: Request) {
  const session = await auth();
  const { pathname } = new URL(request.url);

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userRole = session.user.role as keyof typeof rolePermissions;
  const permissions = rolePermissions[userRole];

  if (!permissions) {
    console.error(`No permissions defined for role: ${userRole}`);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check if the current path matches any allowed routes
  const isAllowed = permissions.allowed.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the current path matches any denied routes
  const isDenied = permissions.denied.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Allow access if the path is allowed and not explicitly denied
  if (isAllowed && !isDenied) {
    return NextResponse.next();
  }

  // Redirect to home page if access is denied
  console.log(`Access denied for ${userRole} to ${pathname}`);
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
