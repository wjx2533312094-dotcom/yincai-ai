import { NextResponse } from "next/server";
import { createLoginCode, normalizePhone, recordLoginCodeSend, validatePhone } from "@/lib/auth";
import { sendLoginSms } from "@/lib/sms";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { phone?: string };
  const phone = normalizePhone(body.phone);

  if (!validatePhone(phone)) {
    return NextResponse.json({ error: "请输入正确的中国大陆手机号。" }, { status: 400 });
  }

  try {
    const code = await createLoginCode(phone);
    const sms = await sendLoginSms(phone, code);
    await recordLoginCodeSend(phone);

    return NextResponse.json({
      message: sms.mode === "development" ? "验证码已生成。" : "验证码已发送。",
      ...(sms.mode === "development" ? { devCode: code } : {})
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "验证码发送失败。" },
      { status: 500 }
    );
  }
}
