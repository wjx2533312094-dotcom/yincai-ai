import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, normalizePhone, validatePhone, verifyLoginCode } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { phone?: string; code?: string; termsAccepted?: boolean };
  const phone = normalizePhone(body.phone);
  const code = typeof body.code === "string" ? body.code.trim() : "";

  if (body.termsAccepted !== true) {
    return NextResponse.json(
      { error: "请先阅读并同意用户协议、隐私政策和 AI 内容说明。" },
      { status: 400 }
    );
  }

  if (!validatePhone(phone)) {
    return NextResponse.json({ error: "请输入正确的中国大陆手机号。" }, { status: 400 });
  }

  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "请输入 6 位验证码。" }, { status: 400 });
  }

  try {
    const session = await verifyLoginCode(phone, code);
    const response = NextResponse.json({ user: session.user });
    response.cookies.set(SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: session.maxAge
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "登录失败，请重试。" },
      { status: 400 }
    );
  }
}
