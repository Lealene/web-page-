import { NextResponse } from "next/server";
import {
  registerUser,
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

  const { name, email, password, "repeat-password": repeatPassword } =
    (body ?? {}) as Record<string, unknown>;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return NextResponse.json(
      { message: "Please fill in your name, email, and password." },
      { status: 400 }
    );
  }

  if (repeatPassword !== undefined && repeatPassword !== password) {
    return NextResponse.json(
      { message: "Those passwords don't match. Please try again." },
      { status: 400 }
    );
  }

  const nameTrimmed = name.trim();
  const emailTrimmed = email.trim().toLowerCase();

  if (nameTrimmed.length < 2) {
    return NextResponse.json(
      { message: "Please enter your name (at least 2 characters)." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { message: "Please choose a password that is at least 6 characters long." },
      { status: 400 }
    );
  }

  seedAdminIfMissing();
  let user: SafeUser;
  try {
    user = registerUser({
      name: nameTrimmed,
      email: emailTrimmed,
      password,
    });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Couldn't create the account." },
      { status: 409 }
    );
  }

  const token = createSessionToken({
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
    exp: sessionExpiresAt().getTime(),
  });

  const response = NextResponse.json(
    {
      message: "Account created. Welcome to Cupang Pandi!",
      redirect: "/ui-upload",
      user,
    },
    { status: 201 }
  );
  response.cookies.set(
    SESSION_COOKIE_NAME,
    token,
    sessionCookieOptions()
  );
  return response;
}
