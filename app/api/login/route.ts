import { NextResponse } from "next/server";
import {
  loginUser,
  seedAdminIfMissing,
  type SafeUser,
} from "@/lib/users";
import {
  SESSION_COOKIE_NAME,
  createSessionToken,
  sessionCookieOptions,
  sessionExpiresAt,
} from "@/lib/session";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Please send a valid JSON body." },
      { status: 400 }
    );
  }

  const { email, password } = (body ?? {}) as Record<string, unknown>;

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { message: "Please enter your email and password." },
      { status: 400 }
    );
  }

  const emailTrimmed = email.trim().toLowerCase();

  seedAdminIfMissing();
  const user = loginUser({ email: emailTrimmed, password });
  if (!user) {
    return NextResponse.json(
      { message: "That email and password don't match. Please try again." },
      { status: 401 }
    );
  }

  const token = createSessionToken({
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
    exp: sessionExpiresAt().getTime(),
  });

  const redirect = user.role === "admin" ? "/admin" : "/ui-upload";

  const response = NextResponse.json(
    { message: "Welcome back!", redirect, user },
    { status: 200 }
  );
  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
  return response;
}
