# 🚀 Render.com 部署指南

## 第一步：准备代码

你的项目已经有了以下文件：
- ✅ `api-server.js` - API 代理服务器
- ✅ `render.yaml` - Render 配置文件
- ✅ `api-package.json` - 依赖配置

## 第二步：部署到 Render.com

### 1. 创建 Render 账号
1. 访问 https://render.com
2. 点击 "Sign Up" 注册（可以使用 GitHub 账号登录）

### 2. 创建新的 Web Service
1. 登录后，点击右上角 **"New +"** 按钮
2. 选择 **"Web Service"**

### 3. 连接代码仓库
选择以下方式之一：

**方式A：从 GitHub 连接**（推荐）
1. 点击 "Connect GitHub"
2. 授权 Render 访问你的 GitHub
3. 选择你的项目仓库

**方式B：直接上传代码**
1. 选择 "Upload a public repository"
2. 或使用 Git 命令推送代码：
   ```bash
   # 如果你还没有 git 仓库，先初始化
   git init
   git add api-server.js api-package.json render.yaml
   git commit -m "Add Zhipu AI proxy server"
   # 推送到 GitHub
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### 4. 配置部署设置

填写以下信息：

| 配置项 | 值 |
|--------|-----|
| **Name** | `zhipu-ai-proxy` |
| **Region** | Singapore (或离你最近的区域) |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install express cors` |
| **Start Command** | `node api-server.js` |

### 5. 环境变量（可选）
点击 "Advanced" → "Add Environment Variable"：
- **Key**: `PORT`
- **Value**: `10000`

### 6. 部署
1. 点击底部的 **"Create Web Service"** 按钮
2. 等待部署完成（约2-5分钟）
3. 部署成功后会显示一个 URL，例如：`https://zhipu-ai-proxy.onrender.com`

## 第三步：测试 API

### 1. 健康检查
在浏览器访问：
```
https://your-service-name.onrender.com/health
```
应该看到：`{"status":"ok","service":"zhipu-ai-proxy"}`

### 2. 测试聊天 API
```bash
curl -X POST https://your-service-name.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4.5-air",
    "messages": [{"role": "user", "content": "你好"}],
    "temperature": 0.7
  }'
```

## 第四步：更新前端代码

### 1. 修改 `src/components/ChatAgent.tsx`

将第 134 行改为：

```typescript
const API_BASE_URL = 'https://your-service-name.onrender.com';

const response = await fetch(`${API_BASE_URL}/api/chat`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'glm-4.5-air',
    messages: buildConversationHistory(),
    temperature: 0.7,
    top_p: 0.9,
  }),
});
```

记得将 `your-service-name.onrender.com` 替换为你的实际 URL。

### 2. 重新构建和部署前端

```bash
npm run build
```

将 `dist` 文件夹上传到你的服务器。

## 第五步：验证

1. 访问你的网站：https://hongxi.nuwax.com
2. 点击左下角的聊天按钮
3. 发送测试消息
4. 应该能正常收到 AI 回复

## 📊 监控和日志

在 Render 控制台：
- 查看 **Logs** 标签页可以看到请求日志
- 查看 **Metrics** 可以看到流量统计
- **Events** 标签页显示部署历史

## ⚠️ 注意事项

1. **免费套餐限制**：
   - 750 小时/月
   - 服务闲置 15 分钟后会休眠
   - 首次请求可能需要 30-60 秒唤醒

2. **唤醒时间**：
   - 免费版休眠后首次访问需要等待
   - 可以使用健康检查端点定期唤醒

3. **API Key 安全**：
   - 当前 API Key 硬编码在代码中
   - 生产环境建议使用环境变量

## 🔄 自动重启

Render 会自动重启崩溃的服务。如果需要手动重启：
1. 进入 Render 控制台
2. 选择你的服务
3. 点击 "Manual Deploy" → "Clear build cache & deploy"

## ❓ 常见问题

**Q: 部署失败怎么办？**
A: 检查 Render 的日志，查看具体错误信息

**Q: 服务总是休眠？**
A: 免费版会休眠，升级到付费版可避免

**Q: 如何更新代码？**
A: 推送新代码到 GitHub，Render 会自动重新部署

## 📞 需要帮助？

将你的 Render 服务 URL 发给我，我帮你验证配置是否正确。
