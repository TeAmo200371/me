// 智谱AI代理服务器
// 可以部署到: Render, Railway, Fly.io, 或任何 Node.js 主机

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 智谱AI配置
const ZHIPU_API_KEY = 'ac5c620de85a4dd49d07e9bbcb838106.2znOjqMZAy3abY7S';
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'zhipu-ai-proxy' });
});

// 聊天API代理
app.post('/api/chat', async (req, res) => {
  try {
    console.log('收到请求:', JSON.stringify(req.body, null, 2));

    const response = await fetch(ZHIPU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZHIPU_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    console.log('智谱AI响应状态:', response.status);

    const data = await response.json();
    console.log('智谱AI响应数据:', JSON.stringify(data, null, 2));

    res.status(response.status).json(data);
  } catch (error) {
    console.error('代理错误:', error);
    res.status(500).json({
      error: '代理服务器错误',
      message: error.message
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`智谱AI代理服务器运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
  console.log(`聊天API: http://localhost:${PORT}/api/chat`);
});
