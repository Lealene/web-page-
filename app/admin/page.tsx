import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  readSessionToken,
} from "@/lib/session";
import AdminPage from "./admin-panel";

export const dynamic = "force-dynamic";

export default async function AdminPageRoute() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = readSessionToken(token);

  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  return <AdminPage />;
}
