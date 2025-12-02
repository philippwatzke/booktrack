import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsApi, seriesApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

// Collections Hooks
export function useCollections(type?: string) {
  return useQuery({
    queryKey: ['collections', type],
    queryFn: async () => {
      const response = await collectionsApi.getAll(type ? { type } : undefined);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch collections');
      }
      return response.data;
    },
  });
}

export function useCollection(id: string) {
  return useQuery({
    queryKey: ['collections', id],
    queryFn: async () => {
      const response = await collectionsApi.getById(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch collection');
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await collectionsApi.create(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create collection');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast({
        title: 'Erfolg',
        description: 'Kollektion erfolgreich erstellt',
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

export function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await collectionsApi.update(id, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update collection');
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collections', variables.id] });
      toast({
        title: 'Erfolg',
        description: 'Kollektion erfolgreich aktualisiert',
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

export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await collectionsApi.delete(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete collection');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast({
        title: 'Erfolg',
        description: 'Kollektion erfolgreich gelöscht',
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

export function useAddBookToCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ collectionId, data }: { collectionId: string; data: any }) => {
      const response = await collectionsApi.addBook(collectionId, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to add book to collection');
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collections', variables.collectionId] });
      toast({
        title: 'Erfolg',
        description: 'Buch zur Kollektion hinzugefügt',
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

export function useRemoveBookFromCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ collectionId, bookId }: { collectionId: string; bookId: string }) => {
      const response = await collectionsApi.removeBook(collectionId, bookId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to remove book from collection');
      }
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collections', variables.collectionId] });
      toast({
        title: 'Erfolg',
        description: 'Buch aus Kollektion entfernt',
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

export function useUpdateBookInCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ collectionId, bookId, data }: { collectionId: string; bookId: string; data: any }) => {
      const response = await collectionsApi.updateBook(collectionId, bookId, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update book in collection');
      }
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collections', variables.collectionId] });
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

// Series Hooks
export function useSeries() {
  return useQuery({
    queryKey: ['series'],
    queryFn: async () => {
      const response = await seriesApi.getAll();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch series');
      }
      return response.data;
    },
  });
}

export function useUserSeries() {
  return useQuery({
    queryKey: ['series', 'user'],
    queryFn: async () => {
      const response = await seriesApi.getUserSeries();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch user series');
      }
      return response.data;
    },
  });
}

export function useSeriesById(id: string) {
  return useQuery({
    queryKey: ['series', id],
    queryFn: async () => {
      const response = await seriesApi.getById(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch series');
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await seriesApi.create(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create series');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
      toast({
        title: 'Erfolg',
        description: 'Reihe erfolgreich erstellt',
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

export function useAddBookToSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ seriesId, data }: { seriesId: string; data: any }) => {
      const response = await seriesApi.addBook(seriesId, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to add book to series');
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
      queryClient.invalidateQueries({ queryKey: ['series', variables.seriesId] });
      toast({
        title: 'Erfolg',
        description: 'Buch zur Reihe hinzugefügt',
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
