import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export const useGenerateQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationId) => {
      const response = await axiosInstance.post(`/api/interviews/generate/${applicationId}`);
      return response.data;
    },
    onSuccess: (data, applicationId) => {
      queryClient.invalidateQueries({ queryKey: ['interview-questions', applicationId] });
    },
  });
};

export const useGetQuestions = (applicationId) => {
  return useQuery({
    queryKey: ['interview-questions', applicationId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/interviews/${applicationId}`);
      return response.data;
    },
    enabled: !!applicationId,
  });
};

export const useDeleteQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationId) => {
      const response = await axiosInstance.delete(`/api/interviews/${applicationId}`);
      return response.data;
    },
    onSuccess: (data, applicationId) => {
      queryClient.invalidateQueries({ queryKey: ['interview-questions', applicationId] });
    },
  });
};

export const useEmailQuestions = () => {
  return useMutation({
    mutationFn: async (applicationId) => {
      const response = await axiosInstance.post(`/api/interviews/${applicationId}/email`);
      return response.data;
    },
  });
};

export const useGetCandidateQuestions = (applicationId) => {
  return useQuery({
    queryKey: ['candidate-interview-prep', applicationId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/interviews/candidate/${applicationId}`);
      return response.data;
    },
    enabled: !!applicationId,
  });
};
