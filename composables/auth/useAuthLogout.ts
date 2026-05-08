export const useAuthLogout = () => {
  const api = useApi();

  const logout = async (): Promise<void> => {
    await api<{ code: number; message: string; data: Record<string, never> }>("/api/v1/auth/logout", {
      method: "POST",
    });
  };

  return { logout };
};
