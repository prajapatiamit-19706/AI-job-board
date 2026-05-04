import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export const useApplyToJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobId, formData }) => {
      const response = await axiosInstance.post(`/api/applications/${jobId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-applications'] });
    },
  });
};

export const useGetCandidateApplications = (options = {}) => {
  return useQuery({
    queryKey: ['candidate-applications'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/applications/my');
      return response.data.data;
    },
    ...options,
  });
};

export const useGetJobApplications = (jobId) => {
  return useQuery({
    queryKey: ['job-applications', jobId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/applications/job/${jobId}`);
      return response.data.data;
    },
    enabled: !!jobId,
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ applicationId, status, interviewDate }) => {
      const response = await axiosInstance.patch(`/api/applications/${applicationId}/status`, { status, interviewDate });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
    },
  });
};

export const useWithdrawApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (applicationId) => {
      const response = await axiosInstance.delete(`/api/applications/${applicationId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-applications'] });
    },
  });
};
