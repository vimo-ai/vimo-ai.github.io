// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  // GitHub Pages 静态部署
  ssr: true,
  nitro: {
    preset: 'github-pages'
  },

  app: {
    baseURL: '/', // GitHub Pages 组织站点不需要子路径
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&display=swap' }
      ]
    }
  }
})
