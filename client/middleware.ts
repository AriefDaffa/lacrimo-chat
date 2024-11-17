import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.getAll();

  console.log("tokennnn", token);
  return NextResponse.redirect(new URL("/login", request.url));
  // return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher:
    "/((?!api|login|register|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
};
