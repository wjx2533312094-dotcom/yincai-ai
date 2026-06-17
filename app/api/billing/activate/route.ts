import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, applyPlan, getUserBySession, PLANS, type PlanId } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  let user;

  try {
    user = await getUserBySession(token);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "服务器数据库未配置。" },
      { status: 500 }
    );
  }

  if (!user) {
    return NextResponse.json({ error: "请先登录后再购买套餐。" }, { status: 401 });
  }

  const body = (await request.json()) as { planId?: PlanId };
  const plan = PLANS.find((item) => item.id === body.planId);

  if (!plan) {
    return NextResponse.json({ error: "套餐不存在。" }, { status: 400 });
  }

  try {
    const updatedUser = await applyPlan(user.phone, plan.id);
    return NextResponse.json({
      user: updatedUser,
      message: `${plan.name} 已开通。`
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "套餐开通失败。" },
      { status: 500 }
    );
  }
}
