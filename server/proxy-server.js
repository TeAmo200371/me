// 简单的 Node.js 代理服务器
// 使用方法：node proxy-server.js

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 从环境变量读取 API Key
const API_KEY = process.env.ZHIPU_API_KEY;

// 检查 API Key 是否配置
if (!API_KEY) {
  console.error('错误: ZHIPU_API_KEY 环境变量未配置');
  console.error('请在 .env 文件中设置 ZHIPU_API_KEY');
  process.exit(1);
}

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, temperature = 0.7, top_p = 0.9 } = req.body;

    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'glm-4.5-air',
        messages,
        temperature,
        top_p,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('代理服务器错误:', error);
    res.status(500).json({ error: '代理服务器错误' });
  }
});

app.listen(PORT, () => {
  console.log(`代理服务器运行在 http://localhost:${PORT}`);
});
