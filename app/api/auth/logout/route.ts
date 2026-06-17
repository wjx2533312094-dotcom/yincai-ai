import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, removeSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  await removeSession(token);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  return response;
}
