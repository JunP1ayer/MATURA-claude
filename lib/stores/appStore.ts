import { create } from 'zustand'
import { persist, createJSONStorage , subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'


// Base types for different app types
export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  category?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface Expense {
  id: string
  title: string
  amount: number
  category: string
  date: string
  type: 'income' | 'expense'
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface Recipe {
  id: string
  title: string
  description?: string
  ingredients: string[]
  instructions?: string[]
  cookingTime: string
  difficulty: 'easy' | 'medium' | 'hard'
  servings?: number
  category?: string
  rating?: number
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface Workout {
  id: string
  title: string
  description?: string
  duration: string
  calories?: number
  exercises?: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  category?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Note {
  id: string
  title: string
  content: string
  category?: string
  tags?: string[]
  pinned?: boolean
  createdAt: string
  updatedAt: string
}

// UI State
export interface UIState {
  theme: 'light' | 'dark' | 'system'
  loading: boolean
  error: string | null
  success: string | null
  activeTab: string
  sidebarOpen: boolean
  searchQuery: string
  filters: {
    category?: string
    priority?: string
    completed?: boolean
    dateRange?: {
      start: string
      end: string
    }
  }
}

// App State
export interface AppState {
  // Data
  tasks: Task[]
  expenses: Expense[]
  recipes: Recipe[]
  workouts: Workout[]
  notes: Note[]
  
  // UI State
  ui: UIState
  
  // Statistics
  stats: {
    totalTasks: number
    completedTasks: number
    totalExpenses: number
    totalIncome: number
    weeklyProgress: number
  }
}

// Actions
export interface AppActions {
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  
  // Expense actions
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateExpense: (id: string, updates: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  
  // Recipe actions
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateRecipe: (id: string, updates: Partial<Recipe>) => void
  deleteRecipe: (id: string) => void
  
  // Workout actions
  addWorkout: (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateWorkout: (id: string, updates: Partial<Workout>) => void
  deleteWorkout: (id: string) => void
  
  // Note actions
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  
  // UI actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSuccess: (success: string | null) => void
  setActiveTab: (tab: string) => void
  setSidebarOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
  setFilters: (filters: Partial<UIState['filters']>) => void
  
  // Utility actions
  calculateStats: () => void
  clearAllData: () => void
  exportData: () => string
  importData: (data: string) => void
}

const initialState: AppState = {
  tasks: [],
  expenses: [],
  recipes: [],
  workouts: [],
  notes: [],
  ui: {
    theme: 'system',
    loading: false,
    error: null,
    success: null,
    activeTab: 'overview',
    sidebarOpen: false,
    searchQuery: '',
    filters: {}
  },
  stats: {
    totalTasks: 0,
    completedTasks: 0,
    totalExpenses: 0,
    totalIncome: 0,
    weeklyProgress: 0
  }
}

export const useAppStore = create<AppState & AppActions>()(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        ...initialState,
        
        // Task actions
        addTask: (taskData) => {
          const now = new Date().toISOString()
          const task: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now
          }
          
          set((state) => {
            state.tasks.push(task)
            state.ui.success = 'Task added successfully'
            state.ui.error = null
          })
          
          get().calculateStats()
        },
        
        updateTask: (id, updates) => {
          set((state) => {
            const taskIndex = state.tasks.findIndex(t => t.id === id)
            if (taskIndex !== -1) {
              state.tasks[taskIndex] = {
                ...state.tasks[taskIndex],
                ...updates,
                updatedAt: new Date().toISOString()
              }
              state.ui.success = 'Task updated successfully'
              state.ui.error = null
            }
          })
          
          get().calculateStats()
        },
        
        deleteTask: (id) => {
          set((state) => {
            state.tasks = state.tasks.filter(t => t.id !== id)
            state.ui.success = 'Task deleted successfully'
            state.ui.error = null
          })
          
          get().calculateStats()
        },
        
        toggleTask: (id) => {
          set((state) => {
            const taskIndex = state.tasks.findIndex(t => t.id === id)
            if (taskIndex !== -1) {
              state.tasks[taskIndex].completed = !state.tasks[taskIndex].completed
              state.tasks[taskIndex].updatedAt = new Date().toISOString()
            }
          })
          
          get().calculateStats()
        },
        
        // Expense actions
        addExpense: (expenseData) => {
          const now = new Date().toISOString()
          const expense: Expense = {
            ...expenseData,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now
          }
          
          set((state) => {
            state.expenses.push(expense)
            state.ui.success = 'Expense added successfully'
            state.ui.error = null
          })
          
          get().calculateStats()
        },
        
        updateExpense: (id, updates) => {
          set((state) => {
            const expenseIndex = state.expenses.findIndex(e => e.id === id)
            if (expenseIndex !== -1) {
              state.expenses[expenseIndex] = {
                ...state.expenses[expenseIndex],
                ...updates,
                updatedAt: new Date().toISOString()
              }
              state.ui.success = 'Expense updated successfully'
              state.ui.error = null
            }
          })
          
          get().calculateStats()
        },
        
        deleteExpense: (id) => {
          set((state) => {
            state.expenses = state.expenses.filter(e => e.id !== id)
            state.ui.success = 'Expense deleted successfully'
            state.ui.error = null
          })
          
          get().calculateStats()
        },
        
        // Recipe actions
        addRecipe: (recipeData) => {
          const now = new Date().toISOString()
          const recipe: Recipe = {
            ...recipeData,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now
          }
          
          set((state) => {
            state.recipes.push(recipe)
            state.ui.success = 'Recipe added successfully'
            state.ui.error = null
          })
        },
        
        updateRecipe: (id, updates) => {
          set((state) => {
            const recipeIndex = state.recipes.findIndex(r => r.id === id)
            if (recipeIndex !== -1) {
              state.recipes[recipeIndex] = {
                ...state.recipes[recipeIndex],
                ...updates,
                updatedAt: new Date().toISOString()
              }
              state.ui.success = 'Recipe updated successfully'
              state.ui.error = null
            }
          })
        },
        
        deleteRecipe: (id) => {
          set((state) => {
            state.recipes = state.recipes.filter(r => r.id !== id)
            state.ui.success = 'Recipe deleted successfully'
            state.ui.error = null
          })
        },
        
        // Workout actions
        addWorkout: (workoutData) => {
          const now = new Date().toISOString()
          const workout: Workout = {
            ...workoutData,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now
          }
          
          set((state) => {
            state.workouts.push(workout)
            state.ui.success = 'Workout added successfully'
            state.ui.error = null
          })
        },
        
        updateWorkout: (id, updates) => {
          set((state) => {
            const workoutIndex = state.workouts.findIndex(w => w.id === id)
            if (workoutIndex !== -1) {
              state.workouts[workoutIndex] = {
                ...state.workouts[workoutIndex],
                ...updates,
                updatedAt: new Date().toISOString()
              }
              state.ui.success = 'Workout updated successfully'
              state.ui.error = null
            }
          })
        },
        
        deleteWorkout: (id) => {
          set((state) => {
            state.workouts = state.workouts.filter(w => w.id !== id)
            state.ui.success = 'Workout deleted successfully'
            state.ui.error = null
          })
        },
        
        // Note actions
        addNote: (noteData) => {
          const now = new Date().toISOString()
          const note: Note = {
            ...noteData,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now
          }
          
          set((state) => {
            state.notes.push(note)
            state.ui.success = 'Note added successfully'
            state.ui.error = null
          })
        },
        
        updateNote: (id, updates) => {
          set((state) => {
            const noteIndex = state.notes.findIndex(n => n.id === id)
            if (noteIndex !== -1) {
              state.notes[noteIndex] = {
                ...state.notes[noteIndex],
                ...updates,
                updatedAt: new Date().toISOString()
              }
              state.ui.success = 'Note updated successfully'
              state.ui.error = null
            }
          })
        },
        
        deleteNote: (id) => {
          set((state) => {
            state.notes = state.notes.filter(n => n.id !== id)
            state.ui.success = 'Note deleted successfully'
            state.ui.error = null
          })
        },
        
        // UI actions
        setTheme: (theme) => {
          set((state) => {
            state.ui.theme = theme
          })
        },
        
        setLoading: (loading) => {
          set((state) => {
            state.ui.loading = loading
          })
        },
        
        setError: (error) => {
          set((state) => {
            state.ui.error = error
            if (error) state.ui.success = null
          })
        },
        
        setSuccess: (success) => {
          set((state) => {
            state.ui.success = success
            if (success) state.ui.error = null
          })
        },
        
        setActiveTab: (tab) => {
          set((state) => {
            state.ui.activeTab = tab
          })
        },
        
        setSidebarOpen: (open) => {
          set((state) => {
            state.ui.sidebarOpen = open
          })
        },
        
        setSearchQuery: (query) => {
          set((state) => {
            state.ui.searchQuery = query
          })
        },
        
        setFilters: (filters) => {
          set((state) => {
            state.ui.filters = { ...state.ui.filters, ...filters }
          })
        },
        
        // Utility actions
        calculateStats: () => {
          set((state) => {
            const totalTasks = state.tasks.length
            const completedTasks = state.tasks.filter(t => t.completed).length
            const totalExpenses = state.expenses
              .filter(e => e.type === 'expense')
              .reduce((sum, e) => sum + e.amount, 0)
            const totalIncome = state.expenses
              .filter(e => e.type === 'income')
              .reduce((sum, e) => sum + e.amount, 0)
            
            const weeklyProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
            
            state.stats = {
              totalTasks,
              completedTasks,
              totalExpenses,
              totalIncome,
              weeklyProgress
            }
          })
        },
        
        clearAllData: () => {
          set(() => ({
            ...initialState,
            ui: {
              ...initialState.ui,
              success: 'All data cleared successfully'
            }
          }))
        },
        
        exportData: () => {
          const state = get()
          return JSON.stringify({
            tasks: state.tasks,
            expenses: state.expenses,
            recipes: state.recipes,
            workouts: state.workouts,
            notes: state.notes,
            exportDate: new Date().toISOString()
          }, null, 2)
        },
        
        importData: (data) => {
          try {
            const parsed = JSON.parse(data)
            set((state) => {
              if (parsed.tasks) state.tasks = parsed.tasks
              if (parsed.expenses) state.expenses = parsed.expenses
              if (parsed.recipes) state.recipes = parsed.recipes
              if (parsed.workouts) state.workouts = parsed.workouts
              if (parsed.notes) state.notes = parsed.notes
              state.ui.success = 'Data imported successfully'
              state.ui.error = null
            })
            get().calculateStats()
          } catch (error) {
            set((state) => {
              state.ui.error = 'Failed to import data: Invalid format'
              state.ui.success = null
            })
          }
        }
      })),
      {
        name: 'matura-app-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          tasks: state.tasks,
          expenses: state.expenses,
          recipes: state.recipes,
          workouts: state.workouts,
          notes: state.notes,
          ui: {
            theme: state.ui.theme,
            activeTab: state.ui.activeTab,
            filters: state.ui.filters
          }
        })
      }
    )
  )
)

// Selectors for better performance
export const useTasksWithFilter = () => {
  return useAppStore((state) => {
    let filteredTasks = state.tasks
    
    if (state.ui.searchQuery) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(state.ui.searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(state.ui.searchQuery.toLowerCase())
      )
    }
    
    if (state.ui.filters.category) {
      filteredTasks = filteredTasks.filter(task => task.category === state.ui.filters.category)
    }
    
    if (state.ui.filters.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === state.ui.filters.priority)
    }
    
    if (state.ui.filters.completed !== undefined) {
      filteredTasks = filteredTasks.filter(task => task.completed === state.ui.filters.completed)
    }
    
    return filteredTasks
  })
}

export const useExpensesWithFilter = () => {
  return useAppStore((state) => {
    let filteredExpenses = state.expenses
    
    if (state.ui.searchQuery) {
      filteredExpenses = filteredExpenses.filter(expense =>
        expense.title.toLowerCase().includes(state.ui.searchQuery.toLowerCase())
      )
    }
    
    if (state.ui.filters.category) {
      filteredExpenses = filteredExpenses.filter(expense => expense.category === state.ui.filters.category)
    }
    
    if (state.ui.filters.dateRange) {
      filteredExpenses = filteredExpenses.filter(expense => {
        const expenseDate = new Date(expense.date)
        const startDate = new Date(state.ui.filters.dateRange!.start)
        const endDate = new Date(state.ui.filters.dateRange!.end)
        return expenseDate >= startDate && expenseDate <= endDate
      })
    }
    
    return filteredExpenses
  })
}