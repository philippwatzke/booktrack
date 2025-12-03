import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { readingSessionsApi } from '@/lib/api';
import { ReadingSession } from '@/types/book';
import { toast } from './use-toast';

export const useReadingSessions = (bookId?: string) => {
  return useQuery({
    queryKey: ['readingSessions', bookId],
    queryFn: async () => {
      if (!bookId) return [];
      const response = await readingSessionsApi.getByBook(bookId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch reading sessions');
      }
      return response.data as ReadingSession[];
    },
    enabled: !!bookId,
  });
};

export const useCreateReadingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { bookId: string; startTime: string; endTime?: string; pagesRead: number; notes?: string }) => {
      const response = await readingSessionsApi.create(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create reading session');
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['readingSessions', variables.bookId] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: 'Erfolg',
        description: 'Lesesession erfolgreich gespeichert',
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
};

export const useUpdateReadingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await readingSessionsApi.update(id, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update reading session');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readingSessions'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: 'Erfolg',
        description: 'Lesesession erfolgreich aktualisiert',
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
};

export const useDeleteReadingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await readingSessionsApi.delete(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete reading session');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readingSessions'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: 'Erfolg',
        description: 'Lesesession erfolgreich gelöscht',
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
};

export const useReadingSessionStats = (bookId: string) => {
  return useQuery({
    queryKey: ['readingSessionStats', bookId],
    queryFn: async () => {
      const response = await readingSessionsApi.getStats(bookId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch session stats');
      }
      return response.data;
    },
    enabled: !!bookId,
  });
};
