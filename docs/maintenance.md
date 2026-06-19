# 影策 AI 维护手册

## 项目信息

- 本地目录：`E:\agent\word`
- 正式域名：`https://yincai.click`
- 工具页：`https://yincai.click/tool`
- Vercel 项目：`yincai-ai`
- GitHub 仓库：`https://github.com/wjx2533312094-dotcom/yincai-ai`
- 数据库：Supabase Postgres

## 本地开发

```powershell
npm.cmd install
npm.cmd run dev
```

本地访问：

```text
http://localhost:3000/tool
```

## 上线前检查

```powershell
npm.cmd run lint
npm.cmd run build
```

## 手动发布到 Vercel

```powershell
npx.cmd --yes vercel@latest --prod
```

如果发布后域名没有自动指向最新版本，可执行：

```powershell
npx.cmd --yes vercel@latest alias set <deployment-url> yincai.click
npx.cmd --yes vercel@latest alias set <deployment-url> www.yincai.click
```

`<deployment-url>` 是发布成功后 CLI 输出的地址，例如：

```text
yincai-ai-xxxxx-wjx2533312094-3814s-projects.vercel.app
```

## Vercel 环境变量

Production 环境必须配置：

```env
DATABASE_URL
OPENAI_API_KEY
OPENAI_API_BASE_URL
OPENAI_MODEL
ALIYUN_ACCESS_KEY_ID
ALIYUN_ACCESS_KEY_SECRET
ALIYUN_SMS_SIGN_NAME
ALIYUN_SMS_TEMPLATE_CODE
```

查看线上环境变量：

```powershell
npx.cmd --yes vercel@latest env ls
```

## 短信验证码

本地开发环境未配置阿里云短信时，接口会返回 `devCode` 方便测试。

Production 环境不会返回 `devCode`。上线使用真实短信前，需要在阿里云短信服务中准备：

```text
AccessKey ID
AccessKey Secret
短信签名
短信模板 CODE
```

短信模板变量名必须包含：

```json
{"code":"123456"}
```

对应 Vercel 环境变量：

```env
ALIYUN_ACCESS_KEY_ID
ALIYUN_ACCESS_KEY_SECRET
ALIYUN_SMS_SIGN_NAME
ALIYUN_SMS_TEMPLATE_CODE
```

## 数据库

建表 SQL 位于：

```text
supabase/schema.sql
```

线上登录、余额、套餐次数依赖这些表：

```text
app_users
login_codes
sessions
orders
```

## 常用验证

检查页面：

```powershell
curl.exe -I https://yincai.click/tool
```

检查验证码接口：

```powershell
@'
const res = await fetch('https://yincai.click/api/auth/send-code', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ phone: '13900000000' })
});
console.log(res.status, await res.text());
'@ | node --input-type=module
```

## Git 版本管理

查看变更：

```powershell
git status -sb
```

提交变更：

```powershell
git add .
git commit -m "描述本次修改"
```

不要提交 `.env.local`、`.env`、`.vercel`、`.next`、`node_modules`。
