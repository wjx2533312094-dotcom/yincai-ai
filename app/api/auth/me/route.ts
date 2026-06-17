import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, getUserBySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  try {
    const user = await getUserBySession(token);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
