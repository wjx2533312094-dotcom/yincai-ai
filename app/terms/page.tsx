import { LegalPage, LegalSection } from "@/app/(legal)/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage title="用户协议" updatedAt="2026-06-17">
      <LegalSection title="1. 服务说明">
        <p>
          影策 AI 提供 AI 辅助短视频脚本生成、分镜、旁白和提示词整理服务。服务输出仅作为创作参考，用户应根据自身业务、平台规则和法律要求进行人工审核。
        </p>
      </LegalSection>
      <LegalSection title="2. 账号与使用次数">
        <p>
          用户可通过手机号验证码登录。系统会根据手机号记录免费次数、付费余额、套餐状态和必要的登录信息。用户应妥善保管自己的设备和登录状态。
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
      <LegalSection title="6. 付费与退款">
        <p>
          套餐价格、权益和有效期以购买页面展示为准。接入真实支付前，当前本地版本中的套餐开通仅为测试功能，不代表真实交易。正式上线时应补充明确的退款、发票和售后规则。
        </p>
      </LegalSection>
      <LegalSection title="7. 免责声明">
        <p>
          在法律允许范围内，本服务不对 AI 输出的商业效果、平台推荐效果、版权无争议性、绝对准确性或适用于特定目的作保证。
        </p>
      </LegalSection>
    </LegalPage>
  );
}
