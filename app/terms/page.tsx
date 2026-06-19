import { LegalPage, LegalSection } from "@/app/(legal)/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage title="用户协议" updatedAt="2026-06-19">
      <LegalSection title="1. 服务说明">
        <p>
          影策 AI 提供 AI 辅助短视频脚本生成、分镜整理、旁白撰写和生成提示词整理服务。服务输出用于创作参考，用户应结合自身业务、平台规则和法律要求进行人工审核。
        </p>
      </LegalSection>
      <LegalSection title="2. 账号与使用次数">
        <p>
          用户可通过手机号验证码登录。系统会根据手机号记录免费次数、付费余额、套餐状态和必要的登录信息。用户应妥善保管自己的设备、验证码和登录状态。
        </p>
      </LegalSection>
      <LegalSection title="3. 用户输入责任">
        <p>
          用户承诺对输入的主题、品牌名、素材、人物信息、参考内容等拥有合法权利或已取得必要授权，不得上传或输入侵犯他人知识产权、隐私权、肖像权、名誉权或其他合法权益的内容。
        </p>
      </LegalSection>
      <LegalSection title="4. 生成内容使用">
        <p>
          AI 生成内容可能存在不准确、重复、相似、遗漏或不适合特定平台发布的情况。用户在发布、商用或交付客户前，应自行核验事实、版权、广告合规、平台规则和行业限制。
        </p>
      </LegalSection>
      <LegalSection title="5. 禁止行为">
        <p>
          用户不得使用本服务生成违法违规、侵权、欺诈、虚假宣传、恶意仿冒、侵犯隐私或绕过平台规则的内容，也不得攻击、滥用、逆向工程或干扰本服务。
        </p>
      </LegalSection>
      <LegalSection title="6. 付费与售后">
        <p>
          套餐价格、权益、有效期和适用范围以购买页面展示为准。因用户自身原因产生的已消耗生成次数通常不支持退回；如遇重复扣次、服务异常或权益未到账，可通过页面提供的反馈入口联系处理。
        </p>
      </LegalSection>
      <LegalSection title="7. 免责声明">
        <p>
          在法律允许范围内，本服务不对 AI 输出的商业效果、平台推荐效果、版权无争议性、绝对准确性或适用于特定目的作保证。用户应对其输入、选择、发布和后续使用行为承担责任。
        </p>
      </LegalSection>
    </LegalPage>
  );
}
