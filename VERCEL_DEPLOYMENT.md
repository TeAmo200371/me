# Vercel 部署指南

## 📋 部署前准备

### 1. 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `ZHIPU_API_KEY` | `492fc070819447cb8e7927219e35858f.itldz34Yi2ly3kyy` | 智谱 AI API 密钥 |
| `ZHIPU_API_MODEL` | `glm-4.6v-flashx` | 模型名称（可选，默认为此值） |

### 2. 添加环境变量步骤

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 点击 **Add New** 添加上述变量
5. 选择适用环境：
   - `Production` - 生产环境
   - `Preview` - 预览环境
   - `Development` - 开发环境
6. 点击 **Save** 保存

## 🚀 部署步骤

### 方法 1：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署到 Vercel
vercel

# 生产环境部署
vercel --prod
```

### 方法 2：通过 Git 集成

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 在 Vercel 中导入项目
3. Vercel 会自动检测 Vite 配置并构建
4. 配置环境变量后，每次推送代码会自动部署

### 方法 3：通过 Vercel Dashboard

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **Add New** → **Project**
3. 导入你的 Git 仓库
4. 配置构建设置：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 配置环境变量
6. 点击 **Deploy**

## 🔍 部署后验证

### 1. 检查部署状态

在 Vercel Dashboard 查看部署日志，确保：
- ✅ 构建成功
- ✅ 环境变量已加载
- ✅ 无错误信息

### 2. 测试 AI 智能助手

1. 访问部署的域名
2. 打开 AI 智能助手（右下角按钮）
3. 发送测试消息
4. 检查是否正常响应

### 3. 查看函数日志

在 Vercel Dashboard → **Functions** 中查看 Serverless Functions 日志：
```
Zhipu AI API error: ...
```

如果看到 API 调用成功的日志，说明配置正确。

## 🛠️ 常见问题

### 问题 1：API 返回 401 或 403

**原因**：API Key 配置错误

**解决**：
1. 检查 Vercel 环境变量中的 `ZHIPU_API_KEY`
2. 确保没有多余的空格或引号
3. 重新部署项目

### 问题 2：API 返回 429

**原因**：请求频率超限

**解决**：
- 等待几秒后重试
- 本项目已添加防重复提交保护

### 问题 3：函数超时

**原因**：AI API 响应时间过长

**解决**：
- `vercel.json` 中已设置 `maxDuration: 30`
- 如需更长超时时间，可升级 Vercel 付费计划

## 📊 监控和优化

### 查看函数使用情况

在 Vercel Dashboard 中：
1. 进入项目 → **Analytics**
2. 查看 Functions 调用次数、响应时间等
3. 优化性能

### 成本优化

- Vercel 免费计划：100 GB 带宽/月
- Serverless Functions：免费计划有调用限制
- 建议：启用缓存减少 API 调用

## 🔐 安全建议

1. ✅ **环境变量**：API Key 存储在环境变量中，不会暴露
2. ✅ **.gitignore**：`.env` 文件已被忽略
3. ✅ **Vercel 安全**：生产环境变量仅对生产环境可见
4. ❌ **不要**：将 API Key 硬编码在代码中
5. ❌ **不要**：将 `.env` 文件提交到 Git

## 📝 配置文件说明

### vercel.json

```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

- `maxDuration`: Serverless Function 最大执行时间（秒）
- 免费计划最大 10 秒，付费计划可达 60 秒

### api/chat.ts

Vercel Serverless Function，处理 AI API 调用：
- 路径：`/api/chat`
- 方法：POST
- 超时：30 秒

## 🎯 快速链接

- [Vercel 文档](https://vercel.com/docs)
- [环境变量配置](https://vercel.com/docs/concepts/projects/environment-variables)
- [Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [智谱 AI 文档](https://open.bigmodel.cn/dev/api)

---

**部署完成后，你的 AI 智能助手将在全球可用的 CDN 上运行，享受极快的访问速度！** 🚀
