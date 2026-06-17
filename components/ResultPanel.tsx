import { CopyButton } from "@/components/CopyButton";
import type { ScriptResult } from "@/lib/script";

type ResultPanelProps = {
  result: ScriptResult;
};

export function ResultPanel({ result }: ResultPanelProps) {
  const allText = formatResult(result);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-brand">生成结果</p>
          <h2 className="mt-1 text-2xl font-semibold text-ink">{result.title}</h2>
        </div>
        <CopyButton text={allText} label="复制全部" />
      </div>

      <ResultBlock title="3秒钩子" text={result.hook} />
      <ResultBlock title="完整脚本" text={result.fullScript} />

      <div className="overflow-hidden rounded-lg border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h3 className="font-semibold text-ink">分镜表</h3>
          <CopyButton text={formatStoryboard(result.storyboard)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">镜头</th>
                <th className="px-4 py-3 font-medium">场景</th>
                <th className="px-4 py-3 font-medium">画面</th>
                <th className="px-4 py-3 font-medium">字幕/台词</th>
                <th className="px-4 py-3 font-medium">时长</th>
              </tr>
            </thead>
            <tbody>
              {result.storyboard.map((row, index) => (
                <tr key={`${row.shot}-${index}`} className="border-t border-line">
                  <td className="px-4 py-3 text-ink">{row.shot || index + 1}</td>
                  <td className="px-4 py-3 text-ink">{row.scene}</td>
                  <td className="px-4 py-3 text-muted">{row.visual}</td>
                  <td className="px-4 py-3 text-muted">{row.copy}</td>
                  <td className="px-4 py-3 text-muted">{row.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ResultBlock title="旁白" text={result.voiceover} />
      <ResultBlock title="ComfyUI 提示词" text={result.comfyuiPrompt} />
      <ResultBlock title="Runway 提示词" text={result.runwayPrompt} />
    </section>
  );
}

function ResultBlock({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-lg border border-line bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h3 className="font-semibold text-ink">{title}</h3>
        <CopyButton text={text} />
      </div>
      <p className="whitespace-pre-wrap px-4 py-4 leading-7 text-slate-700">{text}</p>
    </article>
  );
}

function formatStoryboard(rows: ScriptResult["storyboard"]) {
  return rows
    .map((row) => `${row.shot}｜${row.scene}｜${row.visual}｜${row.copy}｜${row.duration}`)
    .join("\n");
}

function formatResult(result: ScriptResult) {
  return [
    `标题：${result.title}`,
    `3秒钩子：${result.hook}`,
    `完整脚本：\n${result.fullScript}`,
    `分镜表：\n${formatStoryboard(result.storyboard)}`,
    `旁白：\n${result.voiceover}`,
    `ComfyUI 提示词：\n${result.comfyuiPrompt}`,
    `Runway 提示词：\n${result.runwayPrompt}`
  ].join("\n\n");
}
