import { LegalPage, LegalSection } from "@/app/(legal)/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage title="隐私政策" updatedAt="2026-06-19">
      <LegalSection title="1. 我们收集的信息">
        <p>
          为提供登录、次数统计、套餐服务、问题反馈和内容生成能力，我们会处理手机号、验证码校验记录、登录会话、生成次数、套餐状态、必要服务日志，以及用户主动输入的视频主题和生成结果。
        </p>
      </LegalSection>
      <LegalSection title="2. 信息使用目的">
        <p>
          我们使用上述信息用于账号登录、身份校验、生成次数扣减、套餐权益管理、服务安全、问题排查、客户支持和体验改进。
        </p>
      </LegalSection>
      <LegalSection title="3. Cookie 与本地存储">
        <p>
          登录状态通过 HttpOnly Cookie 保存。生成历史记录保存在用户当前浏览器的 localStorage 中，仅用于本地查看和复用，用户可在工具页自行清空。
        </p>
      </LegalSection>
      <LegalSection title="4. 第三方服务">
        <p>
          本服务可能调用 AI 模型服务、短信服务、支付服务、云数据库、托管平台和问题反馈入口。我们仅在实现对应功能所需范围内传递必要数据，并要求相关服务方按照其安全和隐私规则处理数据。
        </p>
      </LegalSection>
      <LegalSection title="5. 信息保存和删除">
        <p>
          我们仅在实现服务目的所需期间保存个人信息。用户可通过页面提供的反馈入口联系运营方，请求查询、更正或删除账号相关信息。
        </p>
      </LegalSection>
      <LegalSection title="6. 安全措施">
        <p>
          我们会采取访问控制、环境变量密钥管理、验证码有效期、Cookie 安全属性、数据库权限隔离等措施保护信息安全。请勿在聊天、工单或公开页面中提交完整 API Key、密码或验证码。
        </p>
      </LegalSection>
      <LegalSection title="7. 未成年人">
        <p>
          本服务主要面向具备独立判断能力的内容创作者和经营主体。未成年人使用本服务前，应取得监护人同意，并避免输入个人敏感信息。
        </p>
      </LegalSection>
    </LegalPage>
  );
}
