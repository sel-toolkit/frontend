export const useLangStore = defineStore("i18n", {
  state: () => ({
    lang: "zh-tw",
  }),
  getters: {
    getLanguage: (state) => state.lang,
  },
  actions: {
    setLanguage(lang: string) {
      this.lang = lang;
    },
  },
});
