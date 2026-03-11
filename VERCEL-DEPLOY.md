# Vercel 部署指南 - API Key 安全配置

## 📋 概述

本项目已配置**后端代理架构**，通过 Vercel Serverless Functions 保护智谱 AI API Key，避免在前端代码中暴露敏感信息。

---

## 🏗️ 架构说明

### 之前的架构（不安全）
```
前端浏览器 ──直接调用──▶ 智谱 AI API
            ↑
      暴露 API Key ❌
```

### 现在的架构（安全）
```
前端浏览器 ──调用──▶ Vercel Serverless Function (/api/chat)
                           ↓
                      智谱 AI API
                           ↑
                    API Key 存储在服务器环境变量 ✅
```

---

## 🚀 Vercel 部署步骤

### 1. 在 Vercel 中配置环境变量

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加以下环境变量：

| 名称 | 值 | 环境 |
|------|-----|------|
| `ZHIPU_API_KEY` | 你的智谱 AI API Key | Production, Preview, Development |

**获取智谱 AI API Key**：
- 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/)
- 注册/登录账号
- 进入"API Key"管理页面
- 创建新的 API Key

### 2. 确保文件正确部署

确认以下文件已提交到 Git 仓库：

```
├── api/
│   └── chat.ts              # Serverless Function
├── src/
│   └── components/
│       └── ChatAgent.tsx    # 前端组件（已修改为调用 /api/chat）
├── vercel.json              # Vercel 配置
└── .env.example             # 环境变量示例
```

### 3. 部署到 Vercel

如果项目已连接到 Vercel，代码提交后会自动部署。

如果尚未部署：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel
```

### 4. 验证部署

部署完成后，检查以下内容：

1. **环境变量是否生效**
   - 在 Vercel Dashboard → Settings → Environment Variables 中确认已添加 `ZHIPU_API_KEY`
   - 重新部署项目以应用环境变量

2. **API 路由是否正常**
   - 访问 `https://your-domain.vercel.app/api/chat`
   - 应该返回 `{"error":"Method not allowed","message":"Only POST requests are accepted"}`

3. **AI 助手是否工作**
   - 打开网站，点击右下角的 AI 助手按钮
   - 发送测试消息，验证是否能正常回复

---

## 🔧 本地开发

### 方式 1: 使用 Vercel CLI（推荐）

可以本地测试 Serverless Function：

```bash
# 安装依赖
npm install

# 启动 Vercel 开发服务器
vercel dev

# 访问 http://localhost:3000
```

**配置本地环境变量**：

创建 `.env.local` 文件（不会被提交到 Git）：

```bash
ZHIPU_API_KEY=your_api_key_here
```

### 方式 2: 使用 Vite 开发服务器（无 API 功能）

如果不需要测试 AI 功能，只需运行：

```bash
npm run dev
```

**注意**：这种方式下 AI 功能无法工作，因为 `/api/chat` 路由仅在 Vercel 环境中可用。

---

## 🔒 安全优势

| 项目 | 之前 | 现在 |
|------|------|------|
| **API Key 存储位置** | 前端代码 | 服务器环境变量 |
| **浏览器可见性** | 暴露在源代码中 | 完全不可见 |
| **访问控制** | 无 | 通过 Serverless Function |
| **速率限制** | 无法控制 | 可在 API 层添加 |
| **日志记录** | 无 | 可记录请求详情 |

---

## 📁 文件变更说明

### 新增文件

- **`api/chat.ts`** - Vercel Serverless Function，代理智谱 AI API 调用

### 修改文件

- **`src/components/ChatAgent.tsx`** - 将 API 调用从直接调用智谱 AI 改为调用 `/api/chat`

**变更详情**：

```typescript
// 之前（不安全）
const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
  headers: {
    'Authorization': 'Bearer ac5c620de85a4dd49d07e9bbcb838106.2znOjqMZAy3abY7S' // ❌ 暴露 API Key
  }
});

// 现在（安全）
const response = await fetch('/api/chat', {
  headers: {
    'Content-Type': 'application/json'
  }
}); // ✅ API Key 存储在服务器端
```

---

## 🛡️ 安全最佳实践

### ✅ 已实现

- [x] API Key 移至服务器环境变量
- [x] 使用 Serverless Function 代理 API 请求
- [x] 移除前端代码中的硬编码 API Key
- [x] 添加错误处理和日志记录

### 🔄 建议增强（可选）

1. **添加请求速率限制**
   - 在 `api/chat.ts` 中添加 IP 限流
   - 防止滥用和超配额

2. **添加请求验证**
   - 验证消息格式和内容长度
   - 防止恶意输入

3. **监控 API 使用量**
   - 在 Vercel Dashboard 中查看函数调用次数
   - 在智谱 AI 控制台监控 API 配额

4. **使用 CORS 保护**
   - 限制只有你的域名可以调用 API
   - 在 `api/chat.ts` 中添加 CORS 头部

---

## 🐛 故障排查

### 问题 1: AI 助手无法回复

**症状**：发送消息后一直显示"输入中"或返回错误

**解决方案**：
1. 检查 Vercel 环境变量是否正确配置
2. 查看 Vercel 函数日志（Dashboard → Functions）
3. 验证智谱 AI API Key 是否有效
4. 检查智谱 AI 账户余额是否充足

### 问题 2: 部署后环境变量不生效

**解决方案**：
1. 在 Vercel Dashboard 中重新添加环境变量
2. 触发新的部署（"Redeploy" 按钮）
3. 确保环境变量应用于所有环境（Production/Preview/Development）

### 问题 3: 本地开发时 API 调用失败

**解决方案**：
1. 使用 `vercel dev` 而不是 `npm run dev`
2. 创建 `.env.local` 文件并添加 `ZHIPU_API_KEY`
3. 确保 `.env.local` 文件在项目根目录

---

## 📚 相关链接

- [Vercel Serverless Functions 文档](https://vercel.com/docs/functions/serverless-functions)
- [Vercel 环境变量配置](https://vercel.com/docs/projects/environment-variables)
- [智谱 AI API 文档](https://open.bigmodel.cn/dev/api)

---

## ✅ 检查清单

部署前请确认：

- [ ] 已将 `ZHIPU_API_KEY` 添加到 Vercel 环境变量
- [ ] 已提交 `api/chat.ts` 到 Git 仓库
- [ ] 已更新 `src/components/ChatAgent.tsx` 移除硬编码的 API Key
- [ ] 已测试 AI 助手功能正常工作
- [ ] 前端代码中不再包含任何 API Key

---

**完成以上步骤后，你的 API Key 将得到完全保护！** 🎉
