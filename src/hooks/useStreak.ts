import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { streaksApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export interface StreakData {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null;
  freezeDaysUsed: number;
  freezeDaysAvailable: number;
}

export interface DailyLog {
  id: string;
  userId: string;
  date: string;
  duration: number;
  pagesRead: number;
  booksRead: string[];
}

export function useStreak() {
  return useQuery({
    queryKey: ['streak'],
    queryFn: async () => {
      const response = await streaksApi.get();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch streak');
      }
      return response.data as StreakData;
    },
  });
}

export function useDailyLogs(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['dailyLogs', params],
    queryFn: async () => {
      const response = await streaksApi.getLogs(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch daily logs');
      }
      return response.data as DailyLog[];
    },
  });
}

export function useFreeze() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: string) => {
      const response = await streaksApi.useFreeze(date);
      if (!response.success) {
        throw new Error(response.error || 'Failed to use freeze day');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streak'] });
      queryClient.invalidateQueries({ queryKey: ['dailyLogs'] });
      toast({
        title: 'Freeze-Tag verwendet',
        description: 'Dein Streak wurde erhalten!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
