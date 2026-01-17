// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@nuxtjs/i18n'
  ],

  // GitHub Pages 静态部署
  ssr: true,
  nitro: {
    preset: 'github-pages'
  },

  // i18n 国际化配置
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'zh', language: 'zh-CN', name: '中文', file: 'zh.json' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    lazy: true,
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },

  // Content 配置
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'vitesse-black',
          langs: ['json', 'bash', 'shell', 'swift', 'typescript', 'javascript', 'markdown', 'toml']
        }
      }
    }
  },

  app: {
    baseURL: '/',
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&display=swap' }
      ]
    }
  }
})
