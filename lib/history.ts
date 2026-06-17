import type { ScriptFormInput, ScriptResult } from "@/lib/script";

export type HistoryItem = {
  id: string;
  createdAt: string;
  form: ScriptFormInput;
  result: ScriptResult;
};

export const HISTORY_STORAGE_KEY = "ai-short-video-script-history";
export const HISTORY_LIMIT = 20;

export function createHistoryItem(
  form: ScriptFormInput,
  result: ScriptResult,
  now = new Date().toISOString()
): HistoryItem {
  return {
    id: `${now}-${cryptoSafeId()}`,
    createdAt: now,
    form,
    result
  };
}

export function limitHistory(items: HistoryItem[], limit = HISTORY_LIMIT) {
  return [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

function cryptoSafeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
}
