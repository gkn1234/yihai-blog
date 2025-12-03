// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    'nuxt-studio',
    '@unocss/nuxt',
    'reka-ui/nuxt',
    '@vueuse/nuxt',
  ],
  css: [
    '~/assets/styles/main.scss',
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/shared.scss" as *;',
        },
      },
    },
  },
  content: {
    build: {
      markdown: {
        toc: {
          depth: 3, // include h3 headings
        },
      },
    },
  },
  studio: {
    repository: {
      provider: 'github',
      owner: 'gkn1234',
      repo: 'yihai-blog',
      branch: 'master',
    },
  },
})
