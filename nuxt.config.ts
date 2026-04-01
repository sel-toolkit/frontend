// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxt/eslint",
    "nuxt-security",
    "@tdesign-vue-next/nuxt",
    "@nuxtjs/i18n",
  ],
  security: {
    corsHandler: {
      origin: process.env.NUXT_BASE_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
    rateLimiter: {
      tokensPerInterval: 150,
      interval: "hour",
    },
    headers: {
      referrerPolicy: "strict-origin-when-cross-origin",
      contentSecurityPolicy: {
        "default-src": ["'self'"],
        "connect-src": [
          "'self'",
          process.env.NUXT_API_BASE_URL,
          process.env.NUXT_WS_BASE_URL,
        ],
      },
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
    },
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  build: {
    transpile: ["tdesign-vue-next"],
  },
  devServer: {
    host: "127.0.0.1",
    port: 3000,
  },
  app: {
    baseURL: "/",
  },
  i18n: {
    defaultLocale: "zh-tw",
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "zh-tw", name: "繁體中文", file: "zh-tw.json" },
    ],
    strategy: "no_prefix",
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_API_BASE_URL,
      siteUrl: process.env.NUXT_BASE_URL,
      nuxtHttp: process.env.NUXT_HTTP
    },
  },
  compatibilityDate: "2024-11-01",
});
