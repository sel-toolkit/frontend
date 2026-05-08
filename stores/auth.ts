import type { Teacher, TeacherProfile } from "~/composables/auth/useAuthMe";

const toProfile = ({ id: _, ...profile }: Teacher): TeacherProfile => profile;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    teacher: null as TeacherProfile | null,
    isReady: false,
    isLoading: false,
  }),
  getters: {
    isAuthenticated: (state) => state.teacher !== null,
  },
  actions: {
    setTeacher(teacher: Teacher | null) {
      this.teacher = teacher ? toProfile(teacher) : null;
    },
    async fetchMe() {
      this.isLoading = true;

      try {
        const { fetchMe } = useAuthMe();
        this.teacher = toProfile(await fetchMe());
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
        this.teacher = toProfile(await loginWithGoogle(idToken));
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
  persist: {
    pick: ["teacher"],
    storage: piniaPluginPersistedstate.localStorage(),
  },
});
