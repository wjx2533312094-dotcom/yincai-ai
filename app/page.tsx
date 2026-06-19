import { ArrowRight, CheckCircle2, Clapperboard, Sparkles, Wand2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  "一次生成标题、钩子、脚本、分镜和旁白",
  "同步产出 ComfyUI 与 Runway 英文提示词",
  "结果可复制，本地保存历史记录，方便反复迭代"
];

export default function HomePage() {
  return (
    <main>
      <section className="bg-white">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-brand">
              <Sparkles className="h-4 w-4" />
              中文短视频创作工作台
            </div>
            <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight text-ink md:text-5xl">
              AI 短视频脚本生成器
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
              输入主题、类型、平台和风格，快速生成适合拍摄、剪辑和 AI 视频制作的完整脚本方案。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tool"
                className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-teal-800"
              >
                开始生成
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-brand hover:text-brand"
              >
                查看能力
              </a>
            </div>
          </div>

          <div className="relative animate-fade-in">
            <Image
              src="/images/hero-script-workspace.png"
              alt="AI 短视频脚本工作台界面"
              width={1120}
              height={760}
              priority
              className="w-full rounded-lg border border-line shadow-soft"
            />
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-line bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-3">
          <Feature icon={<Clapperboard className="h-5 w-5" />} title="从选题到分镜">
            让创意直接落到镜头、字幕、旁白和节奏，不只给一段泛泛文案。
          </Feature>
          <Feature icon={<Wand2 className="h-5 w-5" />} title="面向 AI 视频">
            为 ComfyUI 和 Runway 输出可复制的英文提示词，方便继续生成素材。
          </Feature>
          <Feature icon={<CheckCircle2 className="h-5 w-5" />} title="适合中文平台">
            表单围绕抖音、小红书、视频号等中文内容场景设计，输出更贴近使用习惯。
          </Feature>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature} className="rounded-lg border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
                <CheckCircle2 className="h-5 w-5 text-brand" />
                <p className="mt-3 leading-7 text-slate-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  children
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="transition hover:-translate-y-0.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-100 text-brand">
        {icon}
      </div>
      <h2 className="mt-4 text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-3 leading-7 text-muted">{children}</p>
    </div>
  );
}
