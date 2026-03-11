# 🚀 快速开始 - API Key 保护配置

## 📦 已完成的修改

✅ **新增文件**：
- `api/chat.ts` - Vercel Serverless Function（API 代理）
- `.gitignore` - 防止敏感文件提交
- `.env.example` - 环境变量示例
- `VERCEL-DEPLOY.md` - 详细部署指南

✅ **修改文件**：
- `src/components/ChatAgent.tsx` - 移除硬编码 API Key，改为调用 `/api/chat`
- `package.json` - 添加 `@vercel/node` 类型定义
- `vercel.json` - 配置 API 路由

---

## ⚡ 5 分钟部署步骤

### 步骤 1: 提交代码到 Git

```bash
git add .
git commit -m "feat: 添加 Vercel Serverless API 代理保护 API Key"
git push
```

### 步骤 2: 在 Vercel 配置环境变量

1. 打开 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目 → **Settings** → **Environment Variables**
3. 添加新环境变量：

| 名称 | 值 |
|------|-----|
| `ZHIPU_API_KEY` | `你的智谱AI API Key` |

4. 选择所有环境：**Production**、**Preview**、**Development**
5. 点击 **Save**
6. 点击 **Redeploy** 重新部署项目

### 步骤 3: 验证部署

部署完成后：
1. 访问你的网站
2. 点击右下角的 AI 助手按钮
3. 发送测试消息

✅ 如果能正常回复，说明配置成功！

---

## 🔑 获取智谱 AI API Key

如果你还没有 API Key：

1. 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/)
2. 注册/登录账号
3. 进入"API Key"管理页面
4. 点击"创建 API Key"
5. 复制生成的 Key（格式如：`xxx.xxxxxxxx`）

---

## 🧪 本地开发（可选）

### 使用 Vercel Dev Server（支持 API 功能）

```bash
# 安装 Vercel CLI（首次使用）
npm i -g vercel

# 登录 Vercel
vercel login

# 创建本地环境变量文件
echo "ZHIPU_API_KEY=你的实际API_Key" > .env.local

# 启动开发服务器
vercel dev
```

访问 `http://localhost:3000`，AI 功能将正常工作。

### 使用 Vite 开发服务器（不含 API 功能）

```bash
npm run dev
```

> ⚠️ 注意：这种方式下 AI 助手无法工作，因为 `/api/chat` 仅在 Vercel 环境中可用。

---

## 📊 架构对比

### 之前（不安全）
```javascript
// 前端代码 - 暴露 API Key ❌
fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
  headers: {
    'Authorization': 'Bearer ac5c620de85a4dd49d07e9bbcb838106.2znOjqMZAy3abY7S'
  }
})
```

### 现在（安全）
```javascript
// 前端代码 - 无 API Key ✅
fetch('/api/chat', { body: JSON.stringify({ messages }) })

// 后端代码 - API Key 在服务器
// api/chat.ts
const apiKey = process.env.ZHIPU_API_KEY; // 从环境变量读取
```

---

## 🛡️ 安全优势

| 项目 | 之前 | 现在 |
|------|------|------|
| **API Key 位置** | 前端代码 | 服务器环境变量 |
| **浏览器可见** | 查看源代码可见 | 完全不可见 |
| **安全性** | ❌ 不安全 | ✅ 安全 |

---

## ❓ 常见问题

### Q: 部署后 AI 不回复？
**A**: 检查以下几点：
1. Vercel 环境变量是否正确添加 `ZHIPU_API_KEY`
2. 重新部署项目以应用环境变量
3. 查看 Vercel 函数日志（Dashboard → Functions）

### Q: 本地开发时 API 调用失败？
**A**: 使用 `vercel dev` 命令而不是 `npm run dev`，并创建 `.env.local` 文件。

### Q: API Key 格式是什么样的？
**A**: 智谱 AI API Key 格式：`id.secret`，例如：`ac5c620de85a4dd49d07e9bbcb838106.2znOjqMZAy3abY7S`

---

## 📚 详细文档

查看 `VERCEL-DEPLOY.md` 获取完整的部署指南和故障排查。

---

**需要帮助？** 请查看详细文档 `VERCEL-DEPLOY.md` 或访问：
- [Vercel 文档](https://vercel.com/docs)
- [智谱 AI 文档](https://open.bigmodel.cn/dev/api)
