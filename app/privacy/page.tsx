import { LegalPage, LegalSection } from "@/app/(legal)/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage title="隐私政策" updatedAt="2026-06-17">
      <LegalSection title="1. 我们收集的信息">
        <p>
          为提供登录、次数统计和套餐服务，我们会收集手机号、验证码校验记录、登录会话、生成次数、套餐状态和必要的服务日志。用户输入的视频主题和生成结果可能会用于完成本次生成请求。
        </p>
      </LegalSection>
      <LegalSection title="2. 信息使用目的">
        <p>
          我们使用上述信息用于账号登录、身份校验、生成次数扣减、套餐权益管理、问题排查、安全风控和改进服务体验。
        </p>
      </LegalSection>
      <LegalSection title="3. Cookie 与本地存储">
        <p>
          登录态通过 HttpOnly Cookie 保存。生成历史记录当前保存在用户浏览器 localStorage 中，仅用于本地查看和复用。
        </p>
      </LegalSection>
      <LegalSection title="4. 第三方服务">
        <p>
          本服务可能调用 AI 模型服务、短信服务、支付服务、云数据库和托管平台。正式上线时，应在本政策中列明实际接入的第三方服务名称、处理目的和数据类型。
        </p>
      </LegalSection>
      <LegalSection title="5. 信息保存和删除">
        <p>
          我们仅在实现服务目的所需期间保存个人信息。用户可联系运营方请求查询、更正或删除账号相关信息。生产环境应提供明确的客服邮箱或在线入口。
        </p>
      </LegalSection>
      <LegalSection title="6. 安全措施">
        <p>
          我们会采取访问控制、环境变量密钥管理、验证码有效期、Cookie 安全属性、数据库权限隔离等措施保护信息安全。请勿在聊天、工单或公开页面中提交完整 API Key、密码或验证码。
        </p>
      </LegalSection>
      <LegalSection title="7. 未成年人">
        <p>
          如果服务面向未成年人或可能被未成年人使用，正式上线前应补充监护人同意、内容安全和未成年人个人信息保护规则。
        </p>
      </LegalSection>
    </LegalPage>
  );
}
