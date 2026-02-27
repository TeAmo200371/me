// Vercel Serverless Function for AI Chat API Proxy
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  temperature?: number;
  top_p?: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are accepted'
    });
  }

  try {
    const { messages, temperature = 0.7, top_p = 0.9 }: ChatRequestBody = req.body;

    // 验证请求体
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Messages array is required and must not be empty'
      });
    }

    // 从环境变量获取 API Key
    const apiKey = process.env.ZHIPU_API_KEY;

    if (!apiKey) {
      console.error('ZHIPU_API_KEY is not configured in environment variables');
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'API service is not properly configured'
      });
    }

    // 调用智谱 AI API
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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
      console.error('Zhipu AI API error:', response.status, errorText);

      return res.status(response.status).json({
        error: 'AI service error',
        message: `Failed to call AI service: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();

    // 返回 AI 响应
    return res.status(200).json(data);

  } catch (error) {
    console.error('Chat API error:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing your request'
    });
  }
}

// 配置 Vercel 函数选项
export const config = {
  maxDuration: 30, // 最大执行时间（秒）
};
