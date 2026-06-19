import { randomBytes, randomInt } from "crypto";
import { getDb } from "@/lib/db";

export const SESSION_COOKIE_NAME = "script_session";
export const FREE_GENERATION_LIMIT = 3;
export const DAILY_LOGIN_CODE_LIMIT = 3;
export const MAX_LOGIN_CODE_ATTEMPTS = 5;

export const PLANS = [
  { id: "starter", name: "轻量包", price: "9.9元", credits: 20, description: "适合偶尔生成脚本" },
  { id: "growth", name: "创作者包", price: "29元", credits: 100, description: "适合日常短视频运营" },
  { id: "monthly", name: "无限月卡", price: "99元", credits: null, description: "30 天内不限次数生成" },
  { id: "custom", name: "定制脚本包", price: "299元", credits: 0, description: "适合品牌活动和定制脚本服务" }
] as const;

export type PlanId = (typeof PLANS)[number]["id"];

type UserRow = {
  phone: string;
  free_used: number;
  paid_credits: number;
  unlimited_until: Date | string | null;
  plan_name: string | null;
};

export type AuthUser = {
  phone: string;
  freeUsed: number;
  freeRemaining: number;
  paidCredits: number;
  remaining: number | null;
  unlimitedUntil?: string;
  planName?: string;
};

const codeTtlMs = 10 * 60 * 1000;
const sessionTtlMs = 30 * 24 * 60 * 60 * 1000;

export function normalizePhone(phone: unknown) {
  return typeof phone === "string" ? phone.replace(/\s|-/g, "") : "";
}

export function validatePhone(phone: string) {
  return /^1[3-9]\d{9}$/.test(phone);
}

export async function createLoginCode(phone: string) {
  const sentCount = await getTodayLoginCodeSendCount(phone);

  if (sentCount >= DAILY_LOGIN_CODE_LIMIT) {
    throw new Error("今天验证码次数已用完，请明天再试。");
  }

  const sql = getDb();
  const code = String(randomInt(100000, 1000000));
  const expiresAt = new Date(Date.now() + codeTtlMs);

  await ensureUser(phone);
  await sql`
    insert into login_codes (phone, code, failed_attempts, expires_at)
    values (${phone}, ${code}, 0, ${expiresAt})
    on conflict (phone)
    do update set
      code = excluded.code,
      failed_attempts = 0,
      expires_at = excluded.expires_at,
      created_at = now()
  `;

  return code;
}

export async function recordLoginCodeSend(phone: string) {
  const sql = getDb();
  await ensureUser(phone);
  await sql`insert into login_code_sends (phone) values (${phone})`;
}

export async function verifyLoginCode(phone: string, code: string) {
  const sql = getDb();
  const rows = await sql<{ code: string; failed_attempts: number; expires_at: Date }[]>`
    select code, failed_attempts, expires_at
    from login_codes
    where phone = ${phone}
    limit 1
  `;
  const record = rows[0];

  if (!record) {
    throw new Error("验证码错误或已过期。");
  }

  if (new Date(record.expires_at).getTime() < Date.now()) {
    await sql`delete from login_codes where phone = ${phone}`;
    throw new Error("验证码错误或已过期。");
  }

  if (record.failed_attempts >= MAX_LOGIN_CODE_ATTEMPTS) {
    await sql`delete from login_codes where phone = ${phone}`;
    throw new Error("验证码错误次数过多，请重新获取。");
  }

  if (record.code !== code) {
    await sql`
      update login_codes
      set failed_attempts = failed_attempts + 1
      where phone = ${phone}
    `;
    throw new Error("验证码错误或已过期。");
  }

  await sql`delete from login_codes where phone = ${phone}`;

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + sessionTtlMs);
  await sql`
    insert into sessions (token, phone, expires_at)
    values (${token}, ${phone}, ${expiresAt})
  `;

  return {
    token,
    maxAge: Math.floor(sessionTtlMs / 1000),
    user: await getUserByPhone(phone)
  };
}

export async function getUserBySession(token?: string) {
  if (!token) {
    return null;
  }

  const sql = getDb();
  const rows = await sql<{ phone: string; expires_at: Date }[]>`
    select phone, expires_at
    from sessions
    where token = ${token}
    limit 1
  `;
  const session = rows[0];

  if (!session || new Date(session.expires_at).getTime() < Date.now()) {
    if (session) {
      await sql`delete from sessions where token = ${token}`;
    }
    return null;
  }

  return getUserByPhone(session.phone);
}

export async function assertCanGenerate(phone: string) {
  const user = await getUserByPhone(phone);

  if (user.remaining !== null && user.remaining <= 0) {
    throw new Error("余额不足，请购买套餐后继续生成。");
  }

  return user;
}

export async function consumeGeneration(phone: string) {
  const sql = getDb();
  const user = await getUserByPhone(phone);

  if (user.remaining === null) {
    await touchUser(phone);
    return getUserByPhone(phone);
  }

  if (user.freeRemaining > 0) {
    await sql`
      update app_users
      set free_used = free_used + 1, updated_at = now()
      where phone = ${phone}
    `;
  } else if (user.paidCredits > 0) {
    await sql`
      update app_users
      set paid_credits = paid_credits - 1, updated_at = now()
      where phone = ${phone}
    `;
  } else {
    throw new Error("余额不足，请购买套餐后继续生成。");
  }

  return getUserByPhone(phone);
}

export async function applyPlan(phone: string, planId: PlanId) {
  const sql = getDb();
  const plan = PLANS.find((item) => item.id === planId);

  if (!plan) {
    throw new Error("套餐不存在。");
  }

  await ensureUser(phone);

  if (plan.id === "monthly") {
    const unlimitedUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await sql`
      update app_users
      set plan_name = ${plan.name}, unlimited_until = ${unlimitedUntil}, updated_at = now()
      where phone = ${phone}
    `;
  } else {
    const credits = plan.credits || 1;
    await sql`
      update app_users
      set plan_name = ${plan.name}, paid_credits = paid_credits + ${credits}, updated_at = now()
      where phone = ${phone}
    `;
  }

  await sql`
    insert into orders (phone, plan_id, plan_name, amount_label)
    values (${phone}, ${plan.id}, ${plan.name}, ${plan.price})
  `;

  return getUserByPhone(phone);
}

export async function removeSession(token?: string) {
  if (!token) {
    return;
  }

  const sql = getDb();
  await sql`delete from sessions where token = ${token}`;
}

async function getTodayLoginCodeSendCount(phone: string) {
  const sql = getDb();
  const { start, end } = getChinaDayRange();
  const rows = await sql<{ count: number }[]>`
    select count(*)::int as count
    from login_code_sends
    where phone = ${phone}
      and created_at >= ${start}
      and created_at < ${end}
  `;

  return rows[0]?.count ?? 0;
}

function getChinaDayRange(now = new Date()) {
  const chinaDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);
  const [year, month, day] = chinaDate.split("-").map(Number);
  const utcStartMs = Date.UTC(year, month - 1, day) - 8 * 60 * 60 * 1000;

  return {
    start: new Date(utcStartMs),
    end: new Date(utcStartMs + 24 * 60 * 60 * 1000)
  };
}

async function ensureUser(phone: string) {
  const sql = getDb();
  await sql`
    insert into app_users (phone)
    values (${phone})
    on conflict (phone) do nothing
  `;
}

async function touchUser(phone: string) {
  const sql = getDb();
  await sql`
    update app_users
    set updated_at = now()
    where phone = ${phone}
  `;
}

async function getUserByPhone(phone: string) {
  const sql = getDb();
  await ensureUser(phone);
  const rows = await sql<UserRow[]>`
    select phone, free_used, paid_credits, unlimited_until, plan_name
    from app_users
    where phone = ${phone}
    limit 1
  `;
  return buildUser(rows[0]);
}

function buildUser(row: UserRow): AuthUser {
  const freeRemaining = Math.max(0, FREE_GENERATION_LIMIT - row.free_used);
  const unlimitedUntil = row.unlimited_until ? new Date(row.unlimited_until) : null;
  const unlimitedActive = Boolean(unlimitedUntil && unlimitedUntil.getTime() > Date.now());

  return {
    phone: row.phone,
    freeUsed: row.free_used,
    freeRemaining,
    paidCredits: row.paid_credits,
    remaining: unlimitedActive ? null : freeRemaining + row.paid_credits,
    unlimitedUntil: unlimitedActive && unlimitedUntil ? unlimitedUntil.toISOString() : undefined,
    planName: row.plan_name || undefined
  };
}
