import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quotesApi } from '@/lib/api';
import { Quote } from '@/types/book';
import { toast } from './use-toast';

export const useQuotes = (bookId: string) => {
  return useQuery({
    queryKey: ['quotes', bookId],
    queryFn: async () => {
      const response = await quotesApi.getByBook(bookId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch quotes');
      }
      return response.data as Quote[];
    },
    enabled: !!bookId,
  });
};

export const useCreateQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { bookId: string; text: string; page?: number }) => {
      const response = await quotesApi.create(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create quote');
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotes', variables.bookId] });
      toast({
        title: 'Erfolg',
        description: 'Zitat erfolgreich hinzugefügt',
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

export const useUpdateQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { text: string; page?: number } }) => {
      const response = await quotesApi.update(id, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update quote');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast({
        title: 'Erfolg',
        description: 'Zitat erfolgreich aktualisiert',
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

export const useDeleteQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await quotesApi.delete(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete quote');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast({
        title: 'Erfolg',
        description: 'Zitat erfolgreich gelöscht',
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
