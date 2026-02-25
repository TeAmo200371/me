import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { X, Send, Minimize2, Bot, User, Trash2, ArrowDown, Globe } from 'lucide-react';
import { generateWebsiteSummary, getContactInfo } from '@/lib/website-info';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// 系统提示词
const getSystemPrompt = (websiteInfo?: string, contactInfo?: Record<string, string>) => {
  let prompt = `你是一个友好、专业的AI助手，是洪曦的个人网站的智能客服。

你的职责：
1. 回答访客关于洪曦的问题
2. 介绍网站内容和洪曦的背景信息
3. 提供联系方式和社交链接
4. 用简洁、准确的方式回答用户问题
`;

  if (websiteInfo) {
    prompt += `\n=== 网站信息 ===\n${websiteInfo}\n`;
  }

  if (contactInfo && Object.keys(contactInfo).length > 0) {
    prompt += `\n=== 联系方式 ===\n`;
    Object.entries(contactInfo).forEach(([key, value]) => {
      prompt += `${key}: ${value}\n`;
    });
  }

  prompt += `\n请用友好、专业的语气回答问题。如果问题超出你的知识范围，请诚实告知。`;

  return prompt;
};

interface ChatAgentProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ChatAgent({ isOpen: controlledOpen, onOpenChange }: ChatAgentProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [websiteInfo, setWebsiteInfo] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<Record<string, string>>({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastMessageCountRef = useRef(0);

  // 初始化网站信息
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const info = generateWebsiteSummary();
      const contact = getContactInfo();
      setWebsiteInfo(info);
      setContactInfo(contact);
      console.log('网站信息已加载:', info);
    }
  }, []);

  // 平滑滚动到底部
  const scrollToBottom = useCallback((smooth = true) => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (scrollElement) {
        setIsAutoScrolling(true);

        // 使用 requestAnimationFrame 确保 DOM 已更新
        requestAnimationFrame(() => {
          scrollElement.scrollTo({
            top: scrollElement.scrollHeight,
            behavior: smooth ? 'smooth' : 'auto'
          });

          // 滚动完成后重置标志
          setTimeout(() => {
            setIsAutoScrolling(false);
          }, 500);
        });
      }
    }
  }, []);

  // 检查是否接近底部
  const checkIsNearBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (scrollElement) {
        const threshold = 150; // 距离底部150像素内视为接近底部
        const distance = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight;
        return distance < threshold;
      }
    }
    return true;
  }, []);

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    if (isAutoScrolling) return;

    const isNearBottom = checkIsNearBottom();
    setShowScrollBottom(!isNearBottom);
  }, [checkIsNearBottom, isAutoScrolling]);

  // 消息变化时自动滚动
  useEffect(() => {
    if (messages.length !== lastMessageCountRef.current) {
      lastMessageCountRef.current = messages.length;

      // 延迟滚动，确保 DOM 已完全渲染
      setTimeout(() => {
        scrollToBottom(true);
      }, 50);
    }
  }, [messages.length, scrollToBottom]);

  // 打开对话框时滚动到底部
  useEffect(() => {
    if (isOpen) {
      // 延迟滚动，确保对话框已完全展开
      setTimeout(() => {
        scrollToBottom(true);
      }, 300);
    }
  }, [isOpen, scrollToBottom]);

  // 监听滚动事件
  useEffect(() => {
    if (scrollAreaRef.current && isOpen && !isMinimized) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (scrollElement) {
        scrollElement.addEventListener('scroll', handleScroll);
        return () => {
          scrollElement.removeEventListener('scroll', handleScroll);
        };
      }
    }
  }, [isOpen, isMinimized, handleScroll]);

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    const question = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    // 立即显示用户消息
    setMessages((prev) => [...prev, userMessage]);

    try {
      // 构建消息列表（包含当前用户消息）
      const messageHistory: Array<{ role: string; content: string }> = [
        { role: 'system', content: getSystemPrompt(websiteInfo, contactInfo) },
      ];

      // 添加历史消息
      messages.forEach((msg) => {
        messageHistory.push({
          role: msg.role,
          content: msg.content,
        });
      });

      // 添加当前用户消息（重要：确保至少有一条用户消息）
      messageHistory.push({
        role: 'user',
        content: question,
      });

      // 直接调用智谱AI API
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ac5c620de85a4dd49d07e9bbcb838106.2znOjqMZAy3abY7S',
        },
        body: JSON.stringify({
          model: 'glm-4.5-air',
          messages: messageHistory,
          temperature: 0.7,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 错误:', response.status, errorText);
        throw new Error(`API 请求失败: ${response.status}`);
      }

      const data = await response.json();
      const assistantReply = data.choices?.[0]?.message?.content || '抱歉，我暂时无法回复。';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assistantReply,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI 调用失败:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，连接 AI 服务时出现错误，请稍后再试。',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // 清空对话
  const handleClearMessages = () => {
    setMessages([]);
  };

  // 处理回车发送
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 点击滚动到底部按钮
  const handleScrollToBottom = () => {
    scrollToBottom(true);
    setShowScrollBottom(false);
  };

  // 刷新网站信息
  const handleRefreshWebsiteInfo = () => {
    if (typeof document !== 'undefined') {
      const info = generateWebsiteSummary();
      const contact = getContactInfo();
      setWebsiteInfo(info);
      setContactInfo(contact);

      // 添加系统消息
      const refreshMessage: Message = {
        id: Date.now().toString(),
        content: '✓ 网站信息已刷新',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, refreshMessage]);

      console.log('网站信息已刷新:', info);
    }
  };

  // 处理滚轮事件，支持翻页功能
  const handleWheel = useCallback((e: WheelEvent) => {
    if (scrollAreaRef.current && !isAutoScrolling) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (scrollElement) {
        // 检测是否按住 Shift 键（水平滚动）
        if (e.shiftKey) {
          e.preventDefault();
          scrollElement.scrollLeft += e.deltaY;
        }
        // 垂直滚动使用原生行为，不做拦截
      }
    }
  }, [isAutoScrolling]);

  // 监听滚轮事件
  useEffect(() => {
    if (scrollAreaRef.current && isOpen && !isMinimized) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (scrollElement) {
        scrollElement.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
          scrollElement.removeEventListener('wheel', handleWheel);
        };
      }
    }
  }, [isOpen, isMinimized, handleWheel]);

  return (
    <>
      {/* 聊天窗口 */}
      {isOpen && (
        <div
          className={`fixed bottom-8 left-8 z-50 w-96 max-w-[calc(100vw-4rem)] glass rounded-2xl shadow-2xl shadow-[#d0ff59]/10 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-14' : 'h-[600px] max-h-[calc(100vh-6rem)]'
          }`}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#d0ff59]/20 bg-[#d0ff59]/5 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#d0ff59]/20 flex items-center justify-center border-2 border-[#d0ff59]/40">
                  <Bot className="w-5 h-5 text-[#d0ff59]" />
                </div>
                {/* 在线状态指示器 */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0a0b10] animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">AI 智能助手</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#d0ff59] rounded-full animate-pulse" />
                  <p className="text-xs text-[#d0ff59]/70">在线 - 随时为您服务</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleRefreshWebsiteInfo}
                className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400/70 hover:text-blue-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                aria-label="刷新网站信息"
                title="刷新网站信息"
              >
                <Globe className="w-4 h-4" />
              </button>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearMessages}
                  className="p-1.5 rounded-lg hover:bg-[#d0ff59]/20 text-[#d0ff59]/70 hover:text-[#d0ff59] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d0ff59]"
                  aria-label="清空对话"
                  title="清空对话"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-[#d0ff59]/20 text-[#d0ff59]/70 hover:text-[#d0ff59] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d0ff59]"
                aria-label={isMinimized ? '展开' : '最小化'}
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400/70 hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                aria-label="关闭"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 消息区域 */}
          {!isMinimized && (
            <>
              <div className="relative flex-1 min-h-0">
                <ScrollArea ref={scrollAreaRef} className="h-full px-4 py-3 [&>[data-slot=scroll-area-viewport]]:overflow-y-auto">
                  <div className="space-y-4 pb-2">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <Bot className="w-12 h-12 text-[#d0ff59]/30 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">你好！我是AI助手，有什么可以帮你的吗？</p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user'
                            ? 'bg-blue-500/20'
                            : 'bg-[#d0ff59]/20'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Bot className="w-4 h-4 text-[#d0ff59]" />
                        )}
                      </div>
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          message.role === 'user'
                            ? 'bg-blue-500/20 text-blue-100 rounded-tr-sm'
                            : 'bg-[#d0ff59]/10 text-[#d0ff59]/90 rounded-tl-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            message.role === 'user'
                              ? 'text-blue-400/60'
                              : 'text-[#d0ff59]/50'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* 输入中提示 */}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#d0ff59]/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-[#d0ff59]" />
                      </div>
                      <div className="bg-[#d0ff59]/10 rounded-2xl rounded-tl-sm px-4 py-2.5">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#d0ff59]/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-[#d0ff59]/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-[#d0ff59]/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* 滚动到底部按钮 */}
              {showScrollBottom && (
                <button
                  type="button"
                  onClick={handleScrollToBottom}
                  className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[#d0ff59] text-[#0a0b10] shadow-lg hover:bg-[#d0ff59]/90 transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d0ff59] flex items-center justify-center"
                  aria-label="滚动到底部"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
              )}
            </div>

              {/* 输入区域 */}
              <div className="p-4 border-t border-[#d0ff59]/20 bg-[#d0ff59]/5 flex-shrink-0">
                <div className="flex gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
                    className="min-h-[60px] max-h-32 resize-none bg-[#0a0b10]/50 border-[#d0ff59]/20 text-white placeholder:text-[#d0ff59]/40 focus-visible:ring-[#d0ff59] focus-visible:border-[#d0ff59]"
                  />
                  <Button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="px-3 bg-[#d0ff59] text-[#0a0b10] hover:bg-[#d0ff59]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-[#d0ff59]/40 mt-2 text-center">
                  AI 助手可能产生错误信息，请验证重要内容
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
