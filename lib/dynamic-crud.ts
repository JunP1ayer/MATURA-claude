import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface CrudData {
  [key: string]: any;
}

export function useGetItems(tableName: string) {
  return useQuery({
    queryKey: ['items', tableName],
    queryFn: async () => {
      const response = await fetch(`/api/crud/${tableName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const result = await response.json();
      return result.data || [];
    },
    enabled: !!tableName,
  });
}

export function useGetItem(tableName: string, id: string) {
  return useQuery({
    queryKey: ['item', tableName, id],
    queryFn: async () => {
      const response = await fetch(`/api/crud/${tableName}?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch item');
      }
      const result = await response.json();
      return result.data;
    },
    enabled: !!tableName && !!id,
  });
}

export function useCreateItem(tableName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CrudData) => {
      const response = await fetch(`/api/crud/${tableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create item');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', tableName] });
    },
  });
}

export function useUpdateItem(tableName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CrudData }) => {
      const response = await fetch(`/api/crud/${tableName}?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update item');
      }

      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['items', tableName] });
      queryClient.invalidateQueries({ queryKey: ['item', tableName, id] });
    },
  });
}

export function useDeleteItem(tableName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/crud/${tableName}?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete item');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', tableName] });
    },
  });
}