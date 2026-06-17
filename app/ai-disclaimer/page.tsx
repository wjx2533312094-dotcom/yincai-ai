import { LegalPage, LegalSection } from "@/app/(legal)/LegalPage";

export default function AiDisclaimerPage() {
  return (
    <LegalPage title="AI 内容说明" updatedAt="2026-06-17">
      <LegalSection title="1. AI 辅助性质">
        <p>
          本工具生成的标题、脚本、分镜、旁白和提示词由 AI 辅助完成，适合作为创意草稿和效率工具，不应直接替代专业法律、广告合规、版权审核或品牌审核。
        </p>
      </LegalSection>
      <LegalSection title="2. 可能的风险">
        <p>
          AI 输出可能包含事实错误、过度承诺、平台敏感表达、与已有作品相似的内容、未经验证的数据或不适合特定行业发布的描述。
        </p>
      </LegalSection>
      <LegalSection title="3. 发布前检查">
        <p>
          发布或商用前，请至少检查事实准确性、版权和商标风险、人物肖像和隐私授权、广告法和行业监管要求、平台社区规范、客户品牌规范。
        </p>
      </LegalSection>
      <LegalSection title="4. 不建议生成的内容">
        <p>
          不建议生成仿冒特定博主、复刻品牌广告、照搬影视作品、冒充真实主体、虚构医疗金融效果、侵犯个人隐私或绕过平台审核的内容。
        </p>
      </LegalSection>
      <LegalSection title="5. 用户责任">
        <p>
          用户对其输入内容、选择发布的生成结果以及后续使用行为负责。若用于客户交付或商业投放，建议保留人工审核记录和素材授权记录。
        </p>
      </LegalSection>
    </LegalPage>
  );
}
