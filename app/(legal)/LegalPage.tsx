import type { ReactNode } from "react";

export function LegalPage({
  title,
  updatedAt,
  children
}: {
  title: string;
  updatedAt: string;
  children: ReactNode;
}) {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm font-medium text-brand">正式上线基础文件</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">{title}</h1>
        <p className="mt-3 text-sm text-muted">更新日期：{updatedAt}</p>
        <div className="mt-8 space-y-8 leading-8 text-slate-700">{children}</div>
      </section>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
