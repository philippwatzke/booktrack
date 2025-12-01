import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { goalsApi } from "@/lib/api";

// User Preferences Hooks
export function usePreferences() {
  return useQuery({
    queryKey: ['preferences'],
    queryFn: async () => {
      const response = await goalsApi.getPreferences();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch preferences');
      }
      return response.data;
    },
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await goalsApi.updatePreferences(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update preferences');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });
}

// Reading Goals Hooks
export function useGoals() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await goalsApi.getAll();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch goals');
      }
      return response.data;
    },
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await goalsApi.create(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create goal');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await goalsApi.update(id, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update goal');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await goalsApi.delete(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete goal');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}
