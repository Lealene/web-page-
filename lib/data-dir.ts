import path from "node:path";
import { existsSync } from "node:fs";

/**
 * Returns a writable data directory.
 * On Vercel / Lambda the project directory (/var/task) is read-only (EROFS),
 * so we must write to /tmp. Locally we keep using <cwd>/data.
 */
export function getWritableDataDir(): string {
  const isVercel =
    process.env.VERCEL === "1" ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.cwd().startsWith("/var/task") ||
    process.cwd() === "/var/task";

  if (isVercel) {
    return path.join("/tmp", "data");
  }
  return path.join(process.cwd(), "data");
}

export function getWritableDataPath(...segments: string[]): string {
  return path.join(getWritableDataDir(), ...segments);
}

/**
 * For reads: try writable location first, then fallback to the
 * read-only bundled <cwd>/data (which contains seeded users.json etc).
 * Returns the first path that exists, or the writable path if none exist.
 */
export function getDataPathForRead(...segments: string[]): string {
  const writable = getWritableDataPath(...segments);
  if (existsSync(writable)) return writable;
  const bundled = path.join(process.cwd(), "data", ...segments);
  if (existsSync(bundled)) return bundled;
  return writable; // for writing, will be created
}

export function getDataPathsForRead(...segments: string[]): string[] {
  const writable = getWritableDataPath(...segments);
  const bundled = path.join(process.cwd(), "data", ...segments);
  if (writable === bundled) return [writable];
  return [writable, bundled];
}
