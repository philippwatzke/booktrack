import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '@/lib/api';
import { Book } from '@/types/book';
import { toast } from './use-toast';

export const useBooks = (params?: { status?: string; search?: string }) => {
  return useQuery({
    queryKey: ['books', params],
    queryFn: async () => {
      const response = await booksApi.getAll(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch books');
      }
      return response.data as Book[];
    },
  });
};

export const useBook = (id: string) => {
  return useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const response = await booksApi.getById(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch book');
      }
      return response.data as Book;
    },
    enabled: !!id,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await booksApi.create(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create book');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: 'Erfolg',
        description: 'Buch erfolgreich hinzugefügt',
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

export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await booksApi.update(id, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update book');
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', variables.id] });
      toast({
        title: 'Erfolg',
        description: 'Buch erfolgreich aktualisiert',
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

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await booksApi.delete(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete book');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: 'Erfolg',
        description: 'Buch erfolgreich gelöscht',
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

export const useSearchBookByIsbn = () => {
  return useMutation({
    mutationFn: async (isbn: string) => {
      const response = await booksApi.searchByIsbn(isbn);
      if (!response.success) {
        throw new Error(response.error || 'Failed to search ISBN');
      }
      return response.data;
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
