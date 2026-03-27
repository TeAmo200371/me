import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import appdevDesignMode from "@xagi/vite-plugin-design-mode";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: '/',
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
              const env = loadEnv(mode, process.cwd());
              const apiKey = env.ZHIPU_API_KEY;
              if (apiKey) {
                proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
                console.log('[代理] 请求智谱AI:', proxyReq.path);
              } else {
                console.error('[代理] 警告: ZHIPU_API_KEY 环境变量未配置');
              }
            });
            proxy.on('proxyRes', (proxyRes) => {
              console.log('[代理] 智谱AI响应:', proxyRes.statusCode);
            });
          },
        },
      },
      middlewareMode: false,
      hmr: {
        overlay: true,
      },
    },
  };
});
