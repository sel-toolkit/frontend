export interface Teacher {
  id: number;
  email: string;
  name: string;
  avatarUrl: string;
}

interface MeResponse {
  code: number;
  message: string;
  data: { teacher: Teacher };
}

export const useAuthMe = () => {
  const api = useApi();

  const fetchMe = async (): Promise<Teacher> => {
    const response = await api<MeResponse>("/api/v1/auth/me");
    return response.data.teacher;
  };

  return { fetchMe };
};
