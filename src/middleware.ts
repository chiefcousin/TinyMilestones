import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Refresh Supabase auth session
  const response = await updateSession(request);

  // Set region cookie from Vercel geo header for client-side access
  const country = request.headers.get("x-vercel-ip-country") || "US";
  if (!request.cookies.get("tm-region")) {
    response.cookies.set("tm-region", country, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
