# 智谱AI代理服务器部署指南

由于你的网站已部署在生产环境（https://hongxi.nuwax.com），Vite 开发代理不工作。

## 部署步骤

### 方案1：使用免费云服务部署（推荐）

#### Render.com 部署
1. 访问 https://render.com
2. 创建新账号
3. 点击 "New +" → "Web Service"
4. 连接 GitHub 或粘贴代码
5. 配置：
   - **Root Directory**: `/` (项目根目录)
   - **Build Command**: `npm install`
   - **Start Command**: `node api-server.js`
   - **Environment**: Node
6. 部署后会获得一个 URL，例如：`https://your-api.onrender.com`

#### Railway.app 部署
1. 访问 https://railway.app
2. 创建新项目 → "Deploy from GitHub repo"
3. 配置启动命令：`node api-server.js`
4. 部署完成获得 URL

### 方案2：本地运行（用于测试）

```bash
# 安装依赖
npm install express cors

# 启动服务器
node api-server.js
```

服务器将在 `http://localhost:3000` 运行

### 方案3：使用 ngrok 暴露本地服务器

```bash
# 1. 安装 ngrok
# 下载: https://ngrok.com/download

# 2. 启动 API 服务器
node api-server.js

# 3. 在另一个终端启动 ngrok
ngrok http 3000

# 4. 获得 ngrok URL，例如：https://abc123.ngrok.io
```

## 部署后配置

### 1. 修改前端代码

更新 `src/components/ChatAgent.tsx`:

```typescript
const response = await fetch('YOUR_DEPLOYED_URL/api/chat', {
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

将 `YOUR_DEPLOYED_URL` 替换为你的实际服务器 URL。

### 2. 重新构建前端

```bash
npm run build
```

### 3. 部署更新的前端文件

## 测试

测试 API 是否正常工作：

```bash
curl -X POST https://your-api-server.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4.5-air",
    "messages": [{"role": "user", "content": "你好"}],
    "temperature": 0.7
  }'
```

## 注意事项

- ⚠️ API Key 已暴露在代码中，生产环境应使用环境变量
- ⚠️ 建议为 API 服务器添加访问认证
- ⚠️ 可以添加速率限制防止滥用
