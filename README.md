# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

---

## 🔑 API Key 配置指南

### 如何配置智谱 AI API Key

#### 1. 创建 .env 文件

在项目根目录下已创建 `.env` 文件，请将你的 API Key 填入：

```env
# 智谱 AI API Key
ZHIPU_API_KEY=你的_API_Key

# API 配置（可选）
ZHIPU_API_URL=https://open.bigmodel.cn/api/paas/v4/chat/completions
ZHIPU_API_MODEL=glm-4.5-air
```

#### 2. 获取智谱 AI API Key

1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册/登录账号
3. 进入控制台，创建 API Key
4. 复制 API Key 到 `.env` 文件中的 `ZHIPU_API_KEY`

#### 3. 重启开发服务器

修改 `.env` 文件后，需要重启开发服务器：

```bash
npm run dev
# 或
pnpm dev
# 或
yarn dev
```

### 🔒 安全说明

- ✅ `.env` 文件已被添加到 `.gitignore`，不会提交到 Git 仓库
- ✅ `.env.example` 文件作为配置模板，可以安全提交
- ❌ **切勿**将包含真实 API Key 的 `.env` 文件提交到代码仓库

### 🚀 部署配置

#### Vercel 部署（推荐）

本项目已配置好 Vercel Serverless Functions，可直接部署到 Vercel。

**步骤 1：连接 Vercel**
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录并部署
vercel login
vercel
```

**步骤 2：配置环境变量**

在 Vercel 项目设置中添加以下环境变量：

1. 进入项目 Settings → Environment Variables
2. 添加以下变量：
   - **ZHIPU_API_KEY**: `492fc070819447cb8e7927219e35858f.itldz34Yi2ly3kyy`
   - **ZHIPU_API_MODEL**: `glm-4.6v-flashx`（可选，默认值）
3. 选择环境（Production / Preview / Development）
4. 保存并重新部署项目

**步骤 3：验证部署**

部署完成后，访问你的 Vercel 域名，打开 AI 智能助手测试。

#### 本地开发

本地开发时，API 调用会通过 Vercel Serverless Functions（/api/chat），无需额外配置代理。

#### 其他平台

如果部署到其他平台（Netlify、Railway 等），需要：
1. 确保 Serverless Functions 正确配置
2. 在环境变量中添加 `ZHIPU_API_KEY` 和 `ZHIPU_API_MODEL`
3. 根据平台调整 API 路由配置

### 🔍 验证配置

启动项目后，打开浏览器控制台，查看日志：

```
[代理] 请求智谱AI: /api/paas/v4/chat/completions
[代理] 智谱AI响应: 200
```

如果看到警告：
```
[代理] 警告: ZHIPU_API_KEY 环境变量未配置
```

说明 `.env` 文件未正确配置，请检查：
1. `.env` 文件是否在项目根目录
2. API Key 是否正确填写
3. 是否重启了开发服务器

---

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
