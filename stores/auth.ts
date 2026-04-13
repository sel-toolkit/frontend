export interface Teacher {
  id: number;
  email: string;
  name: string;
  avatarUrl: string;
}

interface GoogleLoginResponseData {
  teacher: Teacher;
}

interface MeResponseData {
  teacher: Teacher;
}

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
        const api = useApi();
        const response = await api<{
          code: number;
          message: string;
          data: MeResponseData;
        }>("/api/v1/auth/me");

        this.teacher = response.data.teacher;
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
        const api = useApi();
        const response = await api<{
          code: number;
          message: string;
          data: GoogleLoginResponseData;
        }>("/api/v1/auth/google/login", {
          method: "POST",
          body: { idToken },
        });

        this.teacher = response.data.teacher;
        this.isReady = true;
        return this.teacher;
      } finally {
        this.isLoading = false;
      }
    },
    async logout() {
      const api = useApi();

      try {
        await api<{ code: number; message: string; data: Record<string, never> }>(
          "/api/v1/auth/logout",
          {
            method: "POST",
          }
        );
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
