import { NextResponse } from "next/server";
import { readUploadedFile } from "@/lib/uploads";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slot: string; file: string }> }
) {
  const { slot, file } = await params;
  const result = readUploadedFile(slot, file);
  if (!result) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(new Uint8Array(result.content), {
    status: 200,
    headers: {
      "Content-Type": result.mimeType,
      "Content-Disposition": `inline; filename="${file}"`,
    },
  });
}