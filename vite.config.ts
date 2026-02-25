import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import appdevDesignMode from "@xagi/vite-plugin-design-mode";

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    
  // <!-- DEV-INJECT-START -->
  {
    name: 'dev-inject',
    enforce: 'post', // 确保在 HTML 注入阶段最后执行
    transformIndexHtml(html) {
      if (!html.includes('data-id="dev-inject-monitor"')) {
        return html.replace("</head>", `
    <script data-id="dev-inject-monitor">
      (function() {
        const remote = "/sdk/dev-monitor.js";
        const separator = remote.includes('?') ? '&' : '?';
        const script = document.createElement('script');
        script.src = remote + separator + 't=' + Date.now();
        script.dataset.id = 'dev-inject-monitor-script';
        script.defer = true;
        // 防止重复注入
        if (!document.querySelector('[data-id="dev-inject-monitor-script"]')) {
          document.head.appendChild(script);
        }
      })();
    </script>
  \n</head>`);
      }
      return html;
    }
  },
  // <!-- DEV-INJECT-END -->
  
    react(),
      appdevDesignMode()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/zhipu-api': {
        target: 'https://open.bigmodel.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zhipu-api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Authorization', 'Bearer ac5c620de85a4dd49d07e9bbcb838106.2znOjqMZAy3abY7S');
            console.log('[代理] 请求智谱AI:', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes) => {
            console.log('[代理] 智谱AI响应:', proxyRes.statusCode);
          });
        },
      },
    },
    // 添加中间件来处理网站信息获取
    middlewareMode: false,
    hmr: {
      overlay: true,
    },
  },
});
