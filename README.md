# 影策 AI - AI 短视频脚本生成器

基于 Next.js + TypeScript + Tailwind CSS + DeepSeek/OpenAI 兼容 API 的中文短视频脚本生成网站。

## 功能

- 首页产品介绍
- 工具页表单：视频主题、视频类型、视频时长、平台、风格
- 服务端调用 DeepSeek/OpenAI 兼容模型
- 输出标题、3 秒钩子、完整脚本、分镜表、旁白、ComfyUI 提示词、Runway 提示词
- 支持单项复制和复制全部
- 浏览器 localStorage 保存本地历史记录
- 手机号验证码登录
- 登录后免费生成 3 次
- 右上角用户菜单：用户设置、余额查看、套餐展示、退出登录
- 套餐定价：9.9 元 20 次、29 元 100 次、99 元无限月卡、299 元定制脚本包
- 用户协议、隐私政策、AI 内容说明

## 本地运行

```bash
npm install
copy .env.example .env.local
npm run dev
```

访问：

```bash
http://localhost:3000
```

## 环境变量

DeepSeek 示例：

```bash
OPENAI_API_KEY=你的DeepSeek API Key
OPENAI_API_BASE_URL=https://api.deepseek.com
OPENAI_MODEL=deepseek-v4-flash
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres
```

OpenAI 示例：

```bash
OPENAI_API_KEY=sk-your-api-key
OPENAI_API_BASE_URL=
OPENAI_MODEL=gpt-4o-mini
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres
```

## Supabase Postgres

正式版使用 Supabase Postgres 保存用户、验证码、登录会话、余额、套餐和订单。

1. 在 Supabase 创建项目。
2. 进入 Supabase SQL Editor。
3. 执行 `supabase/schema.sql`。
4. 进入 Project Settings -> Database -> Connection string。
5. 复制 Supavisor transaction pooler 连接串，通常是端口 `6543`。
6. 在本地 `.env.local` 和 Vercel 环境变量中配置 `DATABASE_URL`。

Vercel/serverless 环境建议使用 Supabase transaction pooler 连接串，不建议直接使用长期直连连接。

## 手机号登录与套餐

当前版本已经把用户、验证码、登录会话和余额迁移到 Supabase Postgres。

短信发送仍是开发版：`/api/auth/send-code` 会生成 6 位验证码并返回 `devCode`，前端自动填入，方便本地测试。生产环境应替换为阿里云短信或腾讯云短信，并且不要向前端返回验证码。

套餐开通当前仍是模拟接口 `/api/billing/activate`，用于验证余额逻辑：

- 9.9 元：20 次生成
- 29 元：100 次生成
- 99 元：无限月卡
- 299 元：定制脚本包

生产环境应接入微信支付或支付宝。套餐权益必须在支付平台服务端回调确认成功后再发放，不能只相信前端按钮。

## 项目结构

```text
app/
  api/auth/logout/route.ts
  api/auth/me/route.ts
  api/auth/send-code/route.ts
  api/auth/verify-code/route.ts
  api/billing/activate/route.ts
  api/generate/route.ts
  ai-disclaimer/page.tsx
  privacy/page.tsx
  terms/page.tsx
  globals.css
  layout.tsx
  page.tsx
  tool/page.tsx
components/
  CopyButton.tsx
  ResultPanel.tsx
  ToolClient.tsx
lib/
  auth.ts
  db.ts
  history.ts
  script.ts
supabase/
  schema.sql
docs/
  launch-checklist.md
```

## 上线提醒

- 生产环境必须配置 `DATABASE_URL`。
- 生产环境应接入真实短信服务，不再返回 `devCode`。
- 真实支付必须以后端回调为准发放套餐余额。
- 中国大陆服务器通常需要 ICP 备案。
- 用户协议、隐私政策和 AI 内容说明上线前建议再由法律专业人士审核。
