import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const qrCodeUrl = process.env.WECHAT_MINIAPP_QR_URL?.trim();
  const appId = process.env.WECHAT_MINIAPP_APP_ID?.trim();
  const label = process.env.WECHAT_MINIAPP_LABEL?.trim() || "微信小程序反馈";

  return NextResponse.json({
    configured: Boolean(qrCodeUrl),
    qrCodeUrl: qrCodeUrl || "",
    appId: appId || "",
    label,
    note: qrCodeUrl ? "扫码进入小程序反馈问题，我们会尽快处理。" : "微信小程序反馈入口已预留，可在环境变量中配置二维码。"
  });
}
