import { NextResponse } from "next/server";
import { readUploadedFile } from "@/lib/uploads";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slot: string; rest: string[] }> }
) {
  const { slot, rest } = await params;
  const relPath = rest.join("/");
  const result = readUploadedFile(slot, relPath);
  if (!result) {
    return new NextResponse("Not found", { status: 404 });
  }
  const fileName = rest[rest.length - 1] ?? "file";
  return new NextResponse(new Uint8Array(result.content), {
    status: 200,
    headers: {
      "Content-Type": result.mimeType,
      "Content-Disposition": `inline; filename="${fileName}"`,
    },
  });
}