import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/session";

function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  return response;
}

export async function POST() {
  const response = NextResponse.json({ message: "Logged out." }, { status: 200 });
  return clearSessionCookie(response);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") ?? "/login";
  const response = NextResponse.redirect(new URL(redirectTo, url.origin));
  return clearSessionCookie(response);
}
