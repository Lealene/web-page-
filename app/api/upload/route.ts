import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  readSessionToken,
} from "@/lib/session";
import {
  isKnownUploadSlot,
} from "@/lib/card-slots";
import { type UploadedFile } from "@/lib/upload-slots";
import { saveSlotItems } from "@/lib/uploads";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = readSessionToken(
    cookieStore.get(SESSION_COOKIE_NAME)?.value
  );
  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { message: "Admins only. Please log in with an admin account." },
      { status: 401 }
    );
  }

  const form = await request.formData();

  const fileBuckets = new Map<string, File[]>();
  const pathsByBucket = new Map<string, string>();
  for (const [field, value] of form.entries()) {
    if (isKnownUploadSlot(field) && value instanceof File) {
      const bucket = fileBuckets.get(field) ?? [];
      bucket.push(value);
      fileBuckets.set(field, bucket);
    } else if (field.startsWith("paths-")) {
      const slotId = field.slice("paths-".length);
      if (isKnownUploadSlot(slotId) && typeof value === "string") {
        pathsByBucket.set(slotId, value);
      }
    }
  }

  const totalFiles = [...fileBuckets.values()].reduce(
    (n, files) => n + files.length,
    0
  );
  if (totalFiles === 0) {
    return NextResponse.json(
      { message: "No files were included in the upload." },
      { status: 400 }
    );
  }

  const folders: Record<string, UploadedFile[]> = {};
  for (const [slotId, files] of fileBuckets) {
    let paths: string[] = [];
    try {
      const parsed = JSON.parse(pathsByBucket.get(slotId) ?? "[]");
      if (Array.isArray(parsed)) {
        paths = parsed.filter((p): p is string => typeof p === "string");
      }
    } catch {
      paths = [];
    }
    folders[slotId] = await saveSlotItems(
      slotId,
      files.map((file, index) => ({
        file,
        relPath: paths.length === files.length ? paths[index] : file.name,
      }))
    );
  }

  revalidatePath("/ui-upload");
  return NextResponse.json({
    message: `Uploaded ${totalFiles} file(s) successfully.`,
    folders,
  });
}
