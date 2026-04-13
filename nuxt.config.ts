// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

const isDev = process.env.NODE_ENV !== "production";
const apiBaseUrl = process.env.NUXT_API_BASE_URL || "http://localhost:8001";
const baseUrl = process.env.NUXT_BASE_URL || "http://localhost:3000";
const wsBaseUrl = process.env.NUXT_WS_BASE_URL || "ws://localhost:8001";

// CSP connect-src 需要根据环境不同
const connectSrcUrls = [
  "'self'",
  apiBaseUrl,
  wsBaseUrl,
  "https://accounts.google.com",
  "https://oauth2.googleapis.com",
  "https://www.googleapis.com",
];

// 本地环境额外加 localhost:8001
if (isDev) {
  connectSrcUrls.push("http://localhost:8001", "ws://localhost:8001");
}

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
      origin: baseUrl,
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
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups", reportOnly: false },
      contentSecurityPolicy: {
        "default-src": ["'self'"],
        // Nuxt hydration relies on inline bootstrap scripts, so keep unsafe-inline here.
        "script-src": ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
        "frame-src": ["'self'", "https://accounts.google.com", "https://accounts.google.com/gsi/"],
        "connect-src": connectSrcUrls,
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
    host: "localhost",
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
      apiBaseUrl: apiBaseUrl,
      siteUrl: baseUrl,
      nuxtHttp: process.env.NUXT_HTTP || "http",
      googleClientId: process.env.NUXT_GOOGLE_CLIENT_ID,
    },
  },
  compatibilityDate: "2024-11-01",
});
