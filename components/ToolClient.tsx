"use client";

import { Clock, History, Loader2, LogOut, RotateCcw, Send, Settings, UserRound, Wallet } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ResultPanel } from "@/components/ResultPanel";
import {
  createHistoryItem,
  HISTORY_STORAGE_KEY,
  limitHistory,
  type HistoryItem
} from "@/lib/history";
import type { ScriptFormInput, ScriptResult } from "@/lib/script";

type AuthUser = {
  phone: string;
  freeUsed: number;
  freeRemaining: number;
  paidCredits: number;
  remaining: number | null;
  unlimitedUntil?: string;
  planName?: string;
};

type Plan = {
  id: "starter" | "growth" | "monthly" | "custom";
  name: string;
  price: string;
  quota: string;
  description: string;
};

const defaultForm: ScriptFormInput = {
  topic: "",
  videoType: "产品种草",
  duration: "30秒",
  platform: "抖音",
  style: "轻松幽默"
};

const videoTypes = ["产品种草", "知识科普", "探店测评", "剧情短片", "口播带货", "品牌宣传"];
const durations = ["15秒", "30秒", "45秒", "60秒", "90秒"];
const platforms = ["抖音", "小红书", "视频号", "B站", "快手"];
const styles = ["轻松幽默", "高级感", "真实口语", "强转化", "治愈温暖", "专业可信"];

const plans: Plan[] = [
  { id: "starter", name: "轻量包", price: "9.9元", quota: "20次生成", description: "适合偶尔创作" },
  { id: "growth", name: "创作者包", price: "29元", quota: "100次生成", description: "适合日常运营" },
  { id: "monthly", name: "无限月卡", price: "99元", quota: "30天不限次数", description: "适合高频产出" },
  { id: "custom", name: "定制脚本包", price: "299元", quota: "专属脚本服务", description: "适合品牌活动" }
];

export function ToolClient() {
  const [form, setForm] = useState<ScriptFormInput>(defaultForm);
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [devCode, setDevCode] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [billingMessage, setBillingMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      setHistory(limitHistory(JSON.parse(raw) as HistoryItem[]));
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data: { user: AuthUser | null }) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const hasBalance = user?.remaining === null || (user?.remaining ?? 0) > 0;
  const canSubmit = useMemo(
    () => Boolean(user) && form.topic.trim().length > 0 && !loading && hasBalance,
    [form.topic, hasBalance, loading, user]
  );

  async function handleSendCode() {
    setAuthLoading(true);
    setAuthMessage("");
    setDevCode("");

    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });
      const data = (await response.json()) as { devCode?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "验证码发送失败。");
      }

      if (data.devCode) {
        setDevCode(data.devCode);
        setCode(data.devCode);
        setAuthMessage("验证码已生成，开发版已自动填入。");
      } else {
        setDevCode("");
        setCode("");
        setAuthMessage("验证码已发送，请查看手机短信。");
      }
    } catch (err) {
      setAuthMessage(err instanceof Error ? err.message : "验证码发送失败。");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogin() {
    setAuthLoading(true);
    setAuthMessage("");

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, termsAccepted })
      });
      const data = (await response.json()) as { user?: AuthUser; error?: string };

      if (!response.ok || !data.user) {
        throw new Error(data.error || "登录失败。");
      }

      setUser(data.user);
      setAuthMessage("登录成功。");
      setDevCode("");
    } catch (err) {
      setAuthMessage(err instanceof Error ? err.message : "登录失败。");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setPhone("");
    setCode("");
    setTermsAccepted(false);
    setDevCode("");
    setAuthMessage("");
    setBillingMessage("");
  }

  async function handleActivatePlan(planId: Plan["id"]) {
    setBillingMessage("");
    const response = await fetch("/api/billing/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId })
    });
    const data = (await response.json()) as { user?: AuthUser; message?: string; error?: string };

    if (!response.ok || !data.user) {
      setBillingMessage(data.error || "套餐开通失败。");
      return;
    }

    setUser(data.user);
    setBillingMessage(data.message || "套餐已开通。");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = (await response.json()) as { result?: ScriptResult; user?: AuthUser; error?: string };

      if (!response.ok || !data.result) {
        throw new Error(data.error || "生成失败，请稍后重试。");
      }

      const generatedResult = data.result;
      setResult(generatedResult);
      if (data.user) {
        setUser(data.user);
      }
      setHistory((items) => limitHistory([createHistoryItem(form, generatedResult), ...items]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  function applyHistory(item: HistoryItem) {
    setForm(item.form);
    setResult(item.result);
    setError("");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand">生成工具</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink">短视频脚本生成</h1>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-soft hover:border-brand hover:text-brand"
          >
            {user ? <Wallet className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}
            {user ? balanceText(user) : "登录 / 余额"}
          </button>
          {menuOpen && (
            <UserMenu
              user={user}
              phone={phone}
              code={code}
              devCode={devCode}
              termsAccepted={termsAccepted}
              authLoading={authLoading}
              authMessage={authMessage}
              billingMessage={billingMessage}
              onPhoneChange={setPhone}
              onCodeChange={setCode}
              onTermsAcceptedChange={setTermsAccepted}
              onSendCode={handleSendCode}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onActivatePlan={handleActivatePlan}
            />
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-6">
          <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <label className="block">
              <span className="text-sm font-medium text-ink">视频主题</span>
              <textarea
                value={form.topic}
                onChange={(event) => setForm({ ...form, topic: event.target.value })}
                placeholder="例如：夏季新品冰咖啡上市，适合办公室白领"
                className="mt-2 h-28 w-full resize-none rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-emerald-100"
                maxLength={120}
              />
            </label>

            <SelectField label="视频类型" value={form.videoType} options={videoTypes} onChange={(value) => setForm({ ...form, videoType: value })} />
            <SelectField label="视频时长" value={form.duration} options={durations} onChange={(value) => setForm({ ...form, duration: value })} />
            <SelectField label="发布平台" value={form.platform} options={platforms} onChange={(value) => setForm({ ...form, platform: value })} />
            <SelectField label="内容风格" value={form.style} options={styles} onChange={(value) => setForm({ ...form, style: value })} />

            {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            {!user && <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">请点击右上角登录后再生成。</p>}
            {user && !hasBalance && <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">余额不足，请在右上角购买套餐。</p>}

            <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {loading ? "生成中" : "生成脚本"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(defaultForm);
                  setResult(null);
                  setError("");
                }}
                className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-line bg-white text-muted hover:border-brand hover:text-brand"
                title="重置"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </form>

          <section className="rounded-lg border border-line bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold text-ink">
                <History className="h-4 w-4" />
                本地历史
              </h2>
              {history.length > 0 && (
                <button type="button" onClick={() => setHistory([])} className="text-sm text-muted hover:text-red-600">
                  清空
                </button>
              )}
            </div>
            <div className="space-y-3">
              {history.length === 0 ? (
                <p className="text-sm leading-6 text-muted">生成后的记录会保存在当前浏览器。</p>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => applyHistory(item)}
                    className="block w-full rounded-md border border-line p-3 text-left hover:border-brand hover:bg-emerald-50"
                  >
                    <p className="line-clamp-1 font-medium text-ink">{item.result.title}</p>
                    <p className="mt-1 line-clamp-1 text-sm text-muted">{item.form.topic}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-muted">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(item.createdAt).toLocaleString("zh-CN")}
                    </p>
                  </button>
                ))
              )}
            </div>
          </section>
        </aside>

        <div>
          {result ? (
            <ResultPanel result={result} />
          ) : (
            <section className="flex min-h-[560px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 text-center">
              <div className="max-w-md">
                <p className="text-sm font-medium text-brand">等待生成</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">填写左侧表单，生成完整短视频方案</h2>
                <p className="mt-3 leading-7 text-muted">
                  输出会包含标题、3 秒钩子、完整脚本、分镜表、旁白，以及 ComfyUI 和 Runway 提示词。
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function UserMenu({
  user,
  phone,
  code,
  devCode,
  termsAccepted,
  authLoading,
  authMessage,
  billingMessage,
  onPhoneChange,
  onCodeChange,
  onTermsAcceptedChange,
  onSendCode,
  onLogin,
  onLogout,
  onActivatePlan
}: {
  user: AuthUser | null;
  phone: string;
  code: string;
  devCode: string;
  termsAccepted: boolean;
  authLoading: boolean;
  authMessage: string;
  billingMessage: string;
  onPhoneChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onTermsAcceptedChange: (value: boolean) => void;
  onSendCode: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onActivatePlan: (planId: Plan["id"]) => void;
}) {
  return (
    <section className="absolute right-0 z-40 mt-3 w-[360px] max-w-[calc(100vw-2rem)] rounded-lg border border-line bg-white p-4 shadow-soft">
      {user ? (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-brand">用户设置</p>
              <h2 className="mt-1 font-semibold text-ink">{maskPhone(user.phone)}</h2>
              <p className="mt-1 text-sm text-muted">{user.planName ? `当前套餐：${user.planName}` : "当前套餐：免费体验"}</p>
            </div>
            <button type="button" onClick={onLogout} className="inline-flex items-center gap-1 text-sm text-muted hover:text-red-600">
              <LogOut className="h-4 w-4" />
              退出
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <BalanceTile label="免费次数" value={`${user.freeRemaining}`} />
            <BalanceTile label="付费余额" value={`${user.paidCredits}`} />
            <BalanceTile label="总余额" value={user.remaining === null ? "无限" : `${user.remaining}`} />
          </div>

          {user.unlimitedUntil && (
            <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-brand">
              无限月卡有效期至 {new Date(user.unlimitedUntil).toLocaleDateString("zh-CN")}
            </p>
          )}

          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink">
              <Settings className="h-4 w-4" />
              套餐定价
            </h3>
            <div className="space-y-2">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => onActivatePlan(plan.id)}
                  className="grid w-full grid-cols-[1fr_auto] gap-3 rounded-md border border-line p-3 text-left hover:border-brand hover:bg-emerald-50"
                >
                  <span>
                    <span className="block font-medium text-ink">{plan.name}</span>
                    <span className="mt-1 block text-xs text-muted">
                      {plan.quota} · {plan.description}
                    </span>
                  </span>
                  <span className="font-semibold text-brand">{plan.price}</span>
                </button>
              ))}
            </div>
          </div>

          {billingMessage && <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-brand">{billingMessage}</p>}
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-brand">手机号登录</p>
            <h2 className="mt-1 text-lg font-semibold text-ink">登录后免费生成 3 次</h2>
          </div>
          <input
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            placeholder="请输入手机号"
            className="h-11 w-full rounded-md border border-line px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-emerald-100"
            inputMode="tel"
            maxLength={13}
          />
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <input
              value={code}
              onChange={(event) => onCodeChange(event.target.value)}
              placeholder="6 位验证码"
              className="h-11 rounded-md border border-line px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-emerald-100"
              inputMode="numeric"
              maxLength={6}
            />
            <button
              type="button"
              onClick={onSendCode}
              disabled={authLoading}
              className="rounded-md border border-line bg-white px-3 text-sm font-medium text-ink hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:text-muted"
            >
              获取验证码
            </button>
          </div>
          <button
            type="button"
            onClick={onLogin}
            disabled={authLoading || !termsAccepted}
            className="h-11 w-full rounded-md bg-ink text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            登录
          </button>
          <label className="flex items-start gap-2 rounded-md bg-slate-50 px-3 py-2 text-xs leading-5 text-muted">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => onTermsAcceptedChange(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-line text-brand"
            />
            <span>
              我已阅读并同意{" "}
              <Link href="/terms" className="font-medium text-brand hover:underline">
                用户协议
              </Link>
              、{" "}
              <Link href="/privacy" className="font-medium text-brand hover:underline">
                隐私政策
              </Link>
              {" "}和{" "}
              <Link href="/ai-disclaimer" className="font-medium text-brand hover:underline">
                AI 内容说明
              </Link>
              。
            </span>
          </label>
          {!termsAccepted && <p className="text-xs text-amber-700">请先勾选同意条款后再登录。</p>}
          {(authMessage || devCode) && (
            <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm leading-6 text-brand">
              {authMessage}
              {devCode ? ` 验证码：${devCode}` : ""}
            </p>
          )}
          <div className="border-t border-line pt-3">
            <h3 className="mb-2 font-semibold text-ink">套餐定价</h3>
            <div className="grid gap-2">
              {plans.map((plan) => (
                <div key={plan.id} className="grid grid-cols-[1fr_auto] gap-3 rounded-md border border-line p-3">
                  <span>
                    <span className="block font-medium text-ink">{plan.name}</span>
                    <span className="mt-1 block text-xs text-muted">
                      {plan.quota} · {plan.description}
                    </span>
                  </span>
                  <span className="font-semibold text-brand">{plan.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function BalanceTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-slate-50 px-3 py-2">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-4 block">
      <span className="text-sm font-medium text-ink">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-emerald-100"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function balanceText(user: AuthUser) {
  if (user.remaining === null) {
    return "无限月卡";
  }
  return `余额 ${user.remaining} 次`;
}

function maskPhone(phone: string) {
  return phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
}
