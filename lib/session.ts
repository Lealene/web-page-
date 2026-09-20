import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "cupangpandi_session";

const SESSION_SECRET =
  process.env.SESSION_SECRET ?? "local-dev-secret-change-me-cupangpandi";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  userId: string;
  role: "admin" | "user";
  email: string;
  name: string;
  exp: number;
}

function sign(input: string): string {
  return createHmac("sha256", SESSION_SECRET).update(input).digest("hex");
}

function encode(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${body}.${sign(body)}`;
}

function decode(token: string): SessionPayload | null {
  const dot = token.lastIndexOf(".");
  if (dot === -1) {
    return null;
  }
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = Buffer.from(sign(body), "hex");
  const actual = Buffer.from(sig, "hex");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8")
    ) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function createSessionToken(payload: SessionPayload): string {
  return encode(payload);
}

export function readSessionToken(
  token: string | undefined | null
): SessionPayload | null {
  if (!token) {
    return null;
  }
  return decode(token);
}

export function sessionExpiresAt(): Date {
  return new Date(Date.now() + MAX_AGE_SECONDS * 1000);
}

export function sessionCookieOptions(): {
  httpOnly: boolean;
  sameSite: "lax";
  path: string;
  secure: boolean;
  maxAge: number;
} {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_SECONDS,
  };
}
