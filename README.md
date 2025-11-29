# Vimo Hub

> A Modular Ecosystem for AI-Enhanced Development

![Vimo Landing Page](/Users/higuaifan/.gemini/antigravity/brain/8f88e34a-aa03-49eb-b182-900c92de51d5/vimo_landing_page_1764401704558.png)

## 项目简介

Vimo Hub 是一个展示型网站，聚合展示以下产品：

- **ETerm** - GPU 加速的插件化终端平台
- **Memex** - AI CLI 的通用记忆协议
- **MCP Router** - MCP 服务路由管理器
- **Vlaude** - Claude Code 跨设备会话同步
- **Claude Helper** - Claude 配额监控工具

## 技术栈

- **框架**: Nuxt 3
- **样式**: TailwindCSS + 自定义赛博朋克主题
- **Logo**: 程序化 SVG（零图片文件）
- **部署**: Cloudflare Pages

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

## 部署至 Cloudflare Pages

### 方式 1: 通过 Dashboard（推荐）

1. 推送代码到 GitHub
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
3. 选择 **Pages** → **Create a project** → **Connect to Git**
4. 选择你的 GitHub 仓库
5. 配置构建设置：
   - **Build command**: `npm run build`
   - **Build output directory**: `.output/public`
   - **Node version**: 20
6. 点击 **Save and Deploy**

### 方式 2: 使用 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 构建项目
npm run build

# 部署
npx wrangler pages deploy .output/public --project-name=vimo
```

## 特性

### 程序化 Logo 系统
所有 Logo 均由代码生成（无图片文件）：
- 无限清晰度（矢量）
- 独立动画控制
- 动态配色

### Mothership 布局
- 中央 Hero（ETerm）
- 悬浮模块卡片
- 基础层（Memex）
- 响应式网格布局

### 交互设计
- Hover 悬停效果
- 技术栈徽章动画
- 一键跳转 GitHub

## License

MIT
