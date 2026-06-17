import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "影策 AI - AI 短视频脚本生成器",
  description: "面向中文创作者的 AI 短视频脚本、分镜、旁白和生成提示词工具。"
};

const legalLinks = [
  { href: "/terms", label: "用户协议" },
  { href: "/privacy", label: "隐私政策" },
  { href: "/ai-disclaimer", label: "AI 内容说明" }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-ink">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-sm text-white">
                影
              </span>
              影策 AI
            </Link>
            <nav className="flex items-center gap-2 text-sm text-muted">
              <Link className="rounded-md px-3 py-2 hover:bg-slate-100 hover:text-ink" href="/">
                首页
              </Link>
              <Link className="rounded-md px-3 py-2 hover:bg-slate-100 hover:text-ink" href="/tool">
                生成工具
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t border-line bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} 影策 AI. AI 辅助创作工具，生成内容请人工审核后使用。</p>
            <nav className="flex flex-wrap gap-3">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-brand">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
