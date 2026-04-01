export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        "mini-mobile": { max: "320px" },
        "tiny-mobile": { max: "360px" },
        "small-mobile": { max: "375px" },
        mobile: { max: "1024px" }, // 1024 以下, 包含 1024
        "large-mobile": { max: "640px" }, // 1024 以下, 包含 1024
        "small-tablet": { max: "768px" },
        tablet: { min: "1025px" }, // 1024 以上, 不包含 1024
        ipad: { min: "1025px", max: "1279px" }, // ipad 版本
        "mini-desktop": { min: "1280px" }, // 1280 以上
        desktop: { min: "1366px" }, // 1366 以上
        "large-desktop": { min: "1920px" }, // 1920 以上
        short: { raw: "(max-height: 700px)" },
        tall: { raw: "(min-height: 1000px)" },
      },
    },
  },
  plugins: [],
};
