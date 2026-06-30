import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Only require auth for /admin routes but allow /admin/login
        if (
          req.nextUrl.pathname.startsWith("/admin") &&
          !req.nextUrl.pathname.startsWith("/admin/login")
        ) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
