import type { Teacher } from "./useAuthMe";

interface GoogleLoginResponse {
  code: number;
  message: string;
  data: { teacher: Teacher };
}

export const useGoogleLogin = () => {
  const api = useApi();

  const loginWithGoogle = async (idToken: string): Promise<Teacher> => {
    const response = await api<GoogleLoginResponse>("/api/v1/auth/google/login", {
      method: "POST",
      body: { idToken },
    });
    return response.data.teacher;
  };

  return { loginWithGoogle };
};
