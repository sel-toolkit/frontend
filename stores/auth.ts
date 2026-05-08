import type { Teacher } from "~/composables/auth/useAuthMe";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    teacher: null as Teacher | null,
    isReady: false,
    isLoading: false,
  }),
  getters: {
    isAuthenticated: (state) => state.teacher !== null,
  },
  actions: {
    setTeacher(teacher: Teacher | null) {
      this.teacher = teacher;
    },
    async fetchMe() {
      this.isLoading = true;

      try {
        const { fetchMe } = useAuthMe();
        this.teacher = await fetchMe();
        this.isReady = true;
        return this.teacher;
      } catch (error) {
        this.teacher = null;
        this.isReady = true;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async ensureSession() {
      if (this.isLoading) {
        return this.teacher;
      }

      if (this.isReady) {
        return this.teacher;
      }

      try {
        return await this.fetchMe();
      } catch {
        return null;
      }
    },
    async loginWithGoogle(idToken: string) {
      this.isLoading = true;

      try {
        const { loginWithGoogle } = useGoogleLogin();
        this.teacher = await loginWithGoogle(idToken);
        this.isReady = true;
        return this.teacher;
      } finally {
        this.isLoading = false;
      }
    },
    async logout() {
      try {
        const { logout } = useAuthLogout();
        await logout();
      } finally {
        this.teacher = null;
        this.isReady = true;
      }
    },
    resetSession() {
      this.teacher = null;
      this.isReady = false;
      this.isLoading = false;
    },
  },
});
