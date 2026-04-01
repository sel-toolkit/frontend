export const useThemeStore = defineStore("theme", {
  state: () => ({
    mode: "dark" as "light" | "dark",
  }),
  actions: {
    setTheme(mode: "light" | "dark") {
      this.mode = mode;
      document.documentElement.setAttribute(
        "theme-mode",
        mode === "dark" ? "dark" : ""
      );
      document.documentElement.classList.toggle("dark", mode === "dark");
      localStorage.setItem("theme-mode", mode);
    },
    initTheme() {
      const saved = localStorage.getItem("theme-mode") as
        | "light"
        | "dark"
        | null;
      if (saved) {
        this.setTheme(saved);
      } else {
        this.setTheme("light");
      }
    },
  },
});
