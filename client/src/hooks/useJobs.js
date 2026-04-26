import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export const useGetJobs = (filters) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/jobs', { params: filters });
      return data.data;
    },
    keepPreviousData: true,
  });
};

export const useGetJobById = (id) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/jobs/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobData) => {
      const { data } = await axiosInstance.post('/api/jobs', jobData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, jobData }) => {
      const { data } = await axiosInstance.put(`/api/jobs/${id}`, jobData);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['job', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
    },
  });
};

export const useCloseJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.patch(`/api/jobs/${id}/close`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/api/jobs/${id}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
    },
  });
};

export const useGetEmployerJobs = () => {
  return useQuery({
    queryKey: ['employer-jobs'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/jobs/employer/my');
      return data.data;
    },
  });
};
