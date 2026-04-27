import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/admin/stats');
      return data.data;
    },
  });
};

export const useApplicationsChart = () => {
  return useQuery({
    queryKey: ['apps-chart'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/admin/applications-chart');
      return data.data;
    },
  });
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/admin/users');
      return data.data;
    },
  });
};

export const useAdminJobs = () => {
  return useQuery({
    queryKey: ['admin-jobs'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/admin/jobs');
      return data.data;
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.patch(`/api/admin/users/${id}/toggle`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
};
