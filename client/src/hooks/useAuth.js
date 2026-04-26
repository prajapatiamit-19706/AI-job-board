import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import useAuthStore from '../store/authStore';

const fetchUser = async () => {
  const { data } = await axiosInstance.get('/api/auth/me');
  return data.data;
};

const useAuth = () => {
  const { token, setAuth, logout } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['authUser'],
    queryFn: fetchUser,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (data && token) {
      setAuth(data, token);
    }
    if (isError) {
      logout();
    }
  }, [data, isError, token, setAuth, logout]);

  return { user: data, isLoading, isError };
};

export default useAuth;
