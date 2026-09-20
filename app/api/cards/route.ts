import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  readSessionToken,
} from "@/lib/session";
import {
  allSlots,
  createCard,
  deleteCard,
  isCustomCard,
  type CardSection,
} from "@/lib/card-slots";
import { clearSlot, listSlotTree } from "@/lib/uploads";

async function adminSession() {
  const cookieStore = await cookies();
  const session = readSessionToken(
    cookieStore.get(SESSION_COOKIE_NAME)?.value
  );
  if (!session || session.role !== "admin") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await adminSession();
  if (!session) {
    return NextResponse.json(
      { message: "Admins only. Please log in with an admin account." },
      { status: 401 }
    );
  }
  const slots = allSlots();
  const folders: Record<string, ReturnType<typeof listSlotTree>> = {};
  for (const slot of [...slots.newSection, ...slots.appsSection]) {
    folders[slot.id] = listSlotTree(slot.id);
  }
  return NextResponse.json({ slots, folders });
}

export async function POST(request: Request) {
  const session = await adminSession();
  if (!session) {
    return NextResponse.json(
      { message: "Admins only. Please log in with an admin account." },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    label?: unknown;
    section?: unknown;
  } | null;
  const label = typeof body?.label === "string" ? body.label.trim() : "";
  const section: CardSection =
    body?.section === "apps" ? "apps" : "new";

  if (!label) {
    return NextResponse.json(
      { message: "Please enter a title for the new page." },
      { status: 400 }
    );
  }

  const card = createCard(label, section);
  revalidatePath("/ui-upload");
  return NextResponse.json({ card }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await adminSession();
  if (!session) {
    return NextResponse.json(
      { message: "Admins only. Please log in with an admin account." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "Please provide a card id." },
      { status: 400 }
    );
  }
  if (!isCustomCard(id)) {
    return NextResponse.json(
      { message: "That card doesn't exist." },
      { status: 404 }
    );
  }

  clearSlot(id);
  deleteCard(id);
  revalidatePath("/ui-upload");
  return NextResponse.json({ message: "Card deleted." });
}