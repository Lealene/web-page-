import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  listFeedback,
  addFeedback,
  togglePin,
  deleteFeedback,
} from "@/lib/feedback";
import { SESSION_COOKIE_NAME, readSessionToken } from "@/lib/session";

export async function GET() {
  const entries = listFeedback();
  return NextResponse.json({ entries }, { status: 200 });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
  }
  const { message, name, type } = (body ?? {}) as Record<string, unknown>;

  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ message: "Please write a message." }, { status: 400 });
  }

  // capture author from session if logged in, otherwise from body
  let authorName: string | null = typeof name === "string" && name.trim() ? name.trim() : null;
  let authorEmail: string | null = null;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = readSessionToken(token);
    if (session) {
      authorName = authorName ?? session.name ?? null;
      authorEmail = session.email ?? null;
    }
  } catch {
    // ignore
  }

  const kind: "feedback" | "quote" = type === "quote" ? "quote" : "feedback";

  try {
    const entry = addFeedback({ message, authorName, authorEmail, type: kind });
    return NextResponse.json({ entry }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Couldn't save feedback." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  // toggle pin - admin only
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = readSessionToken(token);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ message: "Admin access required." }, { status: 403 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
  }
  const { id } = (body ?? {}) as Record<string, unknown>;
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ message: "Missing id." }, { status: 400 });
  }
  const updated = togglePin(id);
  if (!updated) return NextResponse.json({ message: "Not found." }, { status: 404 });
  return NextResponse.json({ entry: updated }, { status: 200 });
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = readSessionToken(token);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ message: "Admin access required." }, { status: 403 });
  }
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "Missing id." }, { status: 400 });
  const ok = deleteFeedback(id);
  if (!ok) return NextResponse.json({ message: "Not found." }, { status: 404 });
  return NextResponse.json({ message: "Deleted." }, { status: 200 });
}
