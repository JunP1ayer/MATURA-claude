import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useHotelBookingStore, useTaskStore, useRecipeStore, useAppMetadataStore } from './store'
import { hotelBookingService, taskService, recipeService, createCRUDService } from './supabase'
import type { HotelBooking, TaskItem, RecipeItem, BaseItem } from './supabase'

// React Query keys
export const queryKeys = {
  hotelBookings: (appId: string) => ['hotel-bookings', appId],
  tasks: (appId: string) => ['tasks', appId],
  recipes: (appId: string) => ['recipes', appId],
  genericItems: (appId: string, type: string) => [type, appId]
}

// Hotel Booking Hooks
export function useHotelBookings(appId: string) {
  const store = useHotelBookingStore()
  
  return useQuery({
    queryKey: queryKeys.hotelBookings(appId),
    queryFn: async () => {
      store.setLoading(true)
      try {
        const bookings = await hotelBookingService.getAll(appId)
        store.setItems(bookings)
        store.setError(null)
        return bookings
      } catch (error: any) {
        store.setError(error.message)
        throw error
      } finally {
        store.setLoading(false)
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!appId
  })
}

export function useCreateHotelBooking(appId: string) {
  const queryClient = useQueryClient()
  const store = useHotelBookingStore()

  return useMutation({
    mutationFn: async (data: Omit<HotelBooking, 'id' | 'created_at' | 'updated_at'>) => {
      return await hotelBookingService.create({ ...data, app_id: appId })
    },
    onSuccess: (newBooking) => {
      store.addItem(newBooking)
      queryClient.invalidateQueries({ queryKey: queryKeys.hotelBookings(appId) })
    },
    onError: (error: any) => {
      store.setError(error.message)
    }
  })
}

export function useUpdateHotelBooking(appId: string) {
  const queryClient = useQueryClient()
  const store = useHotelBookingStore()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<HotelBooking> }) => {
      return await hotelBookingService.update(id, data)
    },
    onSuccess: (updatedBooking) => {
      store.updateItem(updatedBooking.id, updatedBooking)
      queryClient.invalidateQueries({ queryKey: queryKeys.hotelBookings(appId) })
    },
    onError: (error: any) => {
      store.setError(error.message)
    }
  })
}

export function useDeleteHotelBooking(appId: string) {
  const queryClient = useQueryClient()
  const store = useHotelBookingStore()

  return useMutation({
    mutationFn: async (id: string) => {
      await hotelBookingService.delete(id)
      return id
    },
    onSuccess: (deletedId) => {
      store.deleteItem(deletedId)
      queryClient.invalidateQueries({ queryKey: queryKeys.hotelBookings(appId) })
    },
    onError: (error: any) => {
      store.setError(error.message)
    }
  })
}

// Task Management Hooks
export function useTasks(appId: string) {
  const store = useTaskStore()
  
  return useQuery({
    queryKey: queryKeys.tasks(appId),
    queryFn: async () => {
      store.setLoading(true)
      try {
        const tasks = await taskService.getAll(appId)
        store.setItems(tasks)
        store.setError(null)
        return tasks
      } catch (error: any) {
        store.setError(error.message)
        throw error
      } finally {
        store.setLoading(false)
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!appId
  })
}

export function useCreateTask(appId: string) {
  const queryClient = useQueryClient()
  const store = useTaskStore()

  return useMutation({
    mutationFn: async (data: Omit<TaskItem, 'id' | 'created_at' | 'updated_at'>) => {
      return await taskService.create({ ...data, app_id: appId })
    },
    onSuccess: (newTask) => {
      store.addItem(newTask)
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(appId) })
    },
    onError: (error: any) => {
      store.setError(error.message)
    }
  })
}

export function useUpdateTask(appId: string) {
  const queryClient = useQueryClient()
  const store = useTaskStore()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TaskItem> }) => {
      return await taskService.update(id, data)
    },
    onSuccess: (updatedTask) => {
      store.updateItem(updatedTask.id, updatedTask)
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(appId) })
    },
    onError: (error: any) => {
      store.setError(error.message)
    }
  })
}

export function useDeleteTask(appId: string) {
  const queryClient = useQueryClient()
  const store = useTaskStore()

  return useMutation({
    mutationFn: async (id: string) => {
      await taskService.delete(id)
      return id
    },
    onSuccess: (deletedId) => {
      store.deleteItem(deletedId)
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(appId) })
    },
    onError: (error: any) => {
      store.setError(error.message)
    }
  })
}

// Recipe Management Hooks
export function useRecipes(appId: string) {
  const store = useRecipeStore()
  
  return useQuery({
    queryKey: queryKeys.recipes(appId),
    queryFn: async () => {
      store.setLoading(true)
      try {
        const recipes = await recipeService.getAll(appId)
        store.setItems(recipes)
        store.setError(null)
        return recipes
      } catch (error: any) {
        store.setError(error.message)
        throw error
      } finally {
        store.setLoading(false)
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!appId
  })
}

export function useCreateRecipe(appId: string) {
  const queryClient = useQueryClient()
  const store = useRecipeStore()

  return useMutation({
    mutationFn: async (data: Omit<RecipeItem, 'id' | 'created_at' | 'updated_at'>) => {
      return await recipeService.create({ ...data, app_id: appId })
    },
    onSuccess: (newRecipe) => {
      store.addItem(newRecipe)
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes(appId) })
    },
    onError: (error: any) => {
      store.setError(error.message)
    }
  })
}

export function useUpdateRecipe(appId: string) {
  const queryClient = useQueryClient()
  const store = useRecipeStore()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<RecipeItem> }) => {
      return await recipeService.update(id, data)
    },
    onSuccess: (updatedRecipe) => {
      store.updateItem(updatedRecipe.id, updatedRecipe)
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes(appId) })
    },
    onError: (error: any) => {
      store.setError(error.message)
    }
  })
}

export function useDeleteRecipe(appId: string) {
  const queryClient = useQueryClient()
  const store = useRecipeStore()

  return useMutation({
    mutationFn: async (id: string) => {
      await recipeService.delete(id)
      return id
    },
    onSuccess: (deletedId) => {
      store.deleteItem(deletedId)
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes(appId) })
    },
    onError: (error: any) => {
      store.setError(error.message)
    }
  })
}

// Generic CRUD Hooks for any app type
export function useGenericCRUD<T extends BaseItem>(appId: string, itemType: string) {
  const queryClient = useQueryClient()
  const service = createCRUDService<T>()

  const query = useQuery({
    queryKey: queryKeys.genericItems(appId, itemType),
    queryFn: () => service.getAll(appId),
    staleTime: 5 * 60 * 1000,
    enabled: !!appId
  })

  const createMutation = useMutation({
    mutationFn: async (data: Omit<T, 'id' | 'created_at' | 'updated_at'>) => {
      return await service.create({ ...data, app_id: appId } as any)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.genericItems(appId, itemType) })
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<T> }) => {
      return await service.update(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.genericItems(appId, itemType) })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await service.delete(id)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.genericItems(appId, itemType) })
    }
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  }
}

// App-specific hook selector
export function useAppCRUD(appId: string, appType: string) {
  const metadataStore = useAppMetadataStore()
  
  // Set current app context
  React.useEffect(() => {
    if (appId && appType) {
      metadataStore.setCurrentApp(appId, appType)
    }
    return () => metadataStore.clearCurrentApp()
  }, [appId, appType])

  // Return appropriate CRUD hooks based on app type
  switch (appType.toLowerCase()) {
    case 'ホテル予約サイト':
    case 'hotel booking':
    case 'hotel':
      return {
        data: useHotelBookings(appId),
        create: useCreateHotelBooking(appId),
        update: useUpdateHotelBooking(appId),
        delete: useDeleteHotelBooking(appId),
        store: useHotelBookingStore()
      }
      
    case 'タスク管理アプリ':
    case 'task management':
    case 'todo':
    case 'task':
      return {
        data: useTasks(appId),
        create: useCreateTask(appId),
        update: useUpdateTask(appId),
        delete: useDeleteTask(appId),
        store: useTaskStore()
      }
      
    case 'レシピ管理アプリ':
    case 'recipe management':
    case 'recipe':
      return {
        data: useRecipes(appId),
        create: useCreateRecipe(appId),
        update: useUpdateRecipe(appId),
        delete: useDeleteRecipe(appId),
        store: useRecipeStore()
      }
      
    default:
      // Generic CRUD for unknown app types
      return useGenericCRUD(appId, appType)
  }
}