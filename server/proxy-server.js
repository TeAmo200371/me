// 简单的 Node.js 代理服务器
// 使用方法：node proxy-server.js

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const API_KEY = 'ac5c620de85a4dd49d07e9bbcb838106.2znOjqMZAy3abY7S';

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
