import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '@/lib/api';
import { Note } from '@/types/book';
import { toast } from './use-toast';

export const useNotes = (bookId: string) => {
  return useQuery({
    queryKey: ['notes', bookId],
    queryFn: async () => {
      const response = await notesApi.getByBook(bookId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch notes');
      }
      return response.data as Note[];
    },
    enabled: !!bookId,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { bookId: string; content: string; page?: number }) => {
      const response = await notesApi.create(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create note');
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes', variables.bookId] });
      toast({
        title: 'Erfolg',
        description: 'Notiz erfolgreich hinzugefügt',
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

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { content: string; page?: number } }) => {
      const response = await notesApi.update(id, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update note');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate all notes queries that might contain this note
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: 'Erfolg',
        description: 'Notiz erfolgreich aktualisiert',
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

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await notesApi.delete(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete note');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: 'Erfolg',
        description: 'Notiz erfolgreich gelöscht',
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
