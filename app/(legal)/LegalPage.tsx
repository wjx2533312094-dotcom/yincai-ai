import Link from "next/link";

export function LegalPage({
  title,
  updatedAt,
  children
}: {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-4xl px-4 py-12">
        <Link href="/tool" className="text-sm font-medium text-brand hover:underline">
          返回生成工具
        </Link>
        <div className="mt-6 border-b border-line pb-6">
          <p className="text-sm font-medium text-brand">服务规则</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">{title}</h1>
          <p className="mt-3 text-sm text-muted">更新日期：{updatedAt}</p>
        </div>
        <div className="mt-8 space-y-8 text-slate-700">{children}</div>
      </section>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 leading-8">{children}</div>
    </section>
  );
}
