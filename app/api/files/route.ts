import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  readSessionToken,
} from "@/lib/session";
import {
  isKnownUploadSlot,
  allSlots,
} from "@/lib/card-slots";
import {
  listSlotTree,
  deleteUploadedEntry,
  clearSlot,
} from "@/lib/uploads";

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
  const allSlotList = [...slots.newSection, ...slots.appsSection];
  const folders: Record<string, ReturnType<typeof listSlotTree>> = {};
  for (const slot of allSlotList) {
    folders[slot.id] = listSlotTree(slot.id);
  }
  return NextResponse.json({ folders });
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
  const slot = searchParams.get("slot");
  const path = searchParams.get("path");
  const all = searchParams.get("all") === "1";

  if (!slot || !isKnownUploadSlot(slot)) {
    return NextResponse.json(
      { message: "Please provide a valid folder and file path." },
      { status: 400 }
    );
  }

  if (all) {
    const result = clearSlot(slot);
    if (!result.ok) {
      return NextResponse.json(
        { message: result.error ?? "Couldn't empty that box." },
        { status: 500 }
      );
    }
    revalidatePath("/ui-upload");
    return NextResponse.json({
      message: `Deleted ${result.deleted} item(s).`,
    });
  }

  if (!path) {
    return NextResponse.json(
      { message: "Please provide a valid folder and file path." },
      { status: 400 }
    );
  }

  const result = deleteUploadedEntry(slot, path);
  if (!result.ok) {
    return NextResponse.json(
      { message: result.error ?? "Couldn't delete that file." },
      { status: 404 }
    );
  }
  revalidatePath("/ui-upload");
  return NextResponse.json({ message: "Deleted." });
}