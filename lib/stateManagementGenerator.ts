/**
 * State Management Generator
 * 
 * Zustand ベースの完全な状態管理システムを生成
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

export class StateManagementGenerator {
  private projectRoot: string
  private generatedFiles: string[] = []

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot
  }

  /**
   * 完全な状態管理システムを生成
   */
  async generateCompleteStateSystem(): Promise<void> {
    console.log('🔄 Generating complete Zustand state management system...')

    // 1. 型定義
    await this.generateTypeDefinitions()

    // 2. Zustand ストア
    await this.generateZustandStores()

    // 3. カスタムフック
    await this.generateStateHooks()

    // 4. 永続化設定
    await this.generatePersistenceConfig()

    // 5. ユーティリティ
    await this.generateStateUtilities()

    console.log(`✅ Generated ${this.generatedFiles.length} state management files`)
  }

  /**
   * 型定義生成
   */
  private async generateTypeDefinitions(): Promise<void> {
    const typesDir = join(this.projectRoot, 'lib', 'types')
    this.ensureDirectoryExists(typesDir)

    // メインの型定義
    const mainTypes = `// Core Types
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'editor'
  avatar?: string
  createdAt: string
  lastLogin?: string
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'ja' | 'en'
  notifications: {
    email: boolean
    push: boolean
    inApp: boolean
  }
  dashboard: {
    layout: 'grid' | 'list'
    itemsPerPage: number
  }
}

// Business Domain Types
export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'completed' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: string
  updatedAt: string
  dueDate?: string
  ownerId: string
  memberIds: string[]
  tags: string[]
  metadata: Record<string, any>
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  projectId: string
  assigneeId?: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  estimatedHours?: number
  actualHours?: number
  tags: string[]
  attachments: Attachment[]
}

export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: string
  uploadedBy: string
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
  metadata?: Record<string, any>
}

export interface Analytics {
  id: string
  period: 'day' | 'week' | 'month' | 'year'
  metrics: {
    users: {
      total: number
      active: number
      new: number
    }
    projects: {
      total: number
      completed: number
      active: number
    }
    tasks: {
      total: number
      completed: number
      overdue: number
    }
    performance: {
      completionRate: number
      avgTaskTime: number
      productivityScore: number
    }
  }
  createdAt: string
}

// UI State Types
export interface UIState {
  sidebar: {
    collapsed: boolean
    activeSection: string
  }
  modals: {
    [key: string]: boolean
  }
  loading: {
    [key: string]: boolean
  }
  errors: {
    [key: string]: string | null
  }
  filters: {
    projects: ProjectFilters
    tasks: TaskFilters
    users: UserFilters
  }
  search: {
    query: string
    results: SearchResult[]
    isSearching: boolean
  }
}

export interface ProjectFilters {
  status: string[]
  priority: string[]
  owner: string[]
  tags: string[]
  dateRange: {
    start?: string
    end?: string
  }
}

export interface TaskFilters {
  status: string[]
  priority: string[]
  assignee: string[]
  project: string[]
  tags: string[]
  dateRange: {
    start?: string
    end?: string
  }
}

export interface UserFilters {
  role: string[]
  status: string[]
  lastLogin: {
    start?: string
    end?: string
  }
}

export interface SearchResult {
  type: 'project' | 'task' | 'user'
  id: string
  title: string
  description?: string
  url: string
  relevance: number
}

// Store State Types
export interface AppState {
  // User Management
  user: {
    current: User | null
    isAuthenticated: boolean
    permissions: string[]
  }
  
  // Data Management
  projects: {
    items: Project[]
    currentProject: Project | null
    loading: boolean
    error: string | null
  }
  
  tasks: {
    items: Task[]
    currentTask: Task | null
    loading: boolean
    error: string | null
  }
  
  users: {
    items: User[]
    loading: boolean
    error: string | null
  }
  
  notifications: {
    items: Notification[]
    unreadCount: number
    loading: boolean
  }
  
  analytics: {
    current: Analytics | null
    history: Analytics[]
    loading: boolean
    error: string | null
  }
  
  // UI State
  ui: UIState
}

// Action Types
export interface StoreActions {
  // User Actions
  setCurrentUser: (user: User | null) => void
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void
  logout: () => void
  
  // Project Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  setCurrentProject: (project: Project | null) => void
  fetchProjects: () => Promise<void>
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  setCurrentTask: (task: Task | null) => void
  fetchTasks: (projectId?: string) => Promise<void>
  
  // User Management Actions
  fetchUsers: () => Promise<void>
  updateUser: (id: string, updates: Partial<User>) => Promise<void>
  
  // Notification Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  removeNotification: (id: string) => void
  
  // Analytics Actions
  fetchAnalytics: (period: Analytics['period']) => Promise<void>
  
  // UI Actions
  toggleSidebar: () => void
  setActiveSection: (section: string) => void
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  setLoading: (key: string, loading: boolean) => void
  setError: (key: string, error: string | null) => void
  updateFilters: <T extends keyof UIState['filters']>(type: T, filters: Partial<UIState['filters'][T]>) => void
  setSearchQuery: (query: string) => void
  setSearchResults: (results: SearchResult[]) => void
}

// API Response Types
export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    total: number
    page: number
    pageSize: number
  }
}

// Form Types
export interface CreateProjectForm {
  name: string
  description: string
  priority: Project['priority']
  dueDate?: string
  memberIds: string[]
  tags: string[]
}

export interface CreateTaskForm {
  title: string
  description?: string
  priority: Task['priority']
  projectId: string
  assigneeId?: string
  dueDate?: string
  estimatedHours?: number
  tags: string[]
}

export interface UserProfileForm {
  name: string
  email: string
  preferences: UserPreferences
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type LoadingState = Record<string, boolean>
export type ErrorState = Record<string, string | null>

export type EntityWithId = { id: string }
export type CreateEntity<T extends EntityWithId> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateEntity<T> = Partial<T>`

    const mainTypesPath = join(typesDir, 'index.ts')
    writeFileSync(mainTypesPath, mainTypes)
    this.generatedFiles.push(mainTypesPath)

    // API型定義
    const apiTypes = `import { APIResponse } from './index'

// API Client Types
export interface APIClientConfig {
  baseURL: string
  timeout: number
  retries: number
  retryDelay: number
}

export interface RequestOptions {
  headers?: Record<string, string>
  timeout?: number
  retries?: number
  signal?: AbortSignal
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SearchParams extends PaginationParams {
  query?: string
  filters?: Record<string, any>
}

// Specific API Endpoint Types
export interface ProjectsAPI {
  getAll(params?: SearchParams): Promise<APIResponse<Project[]>>
  getById(id: string): Promise<APIResponse<Project>>
  create(data: CreateProjectForm): Promise<APIResponse<Project>>
  update(id: string, data: Partial<Project>): Promise<APIResponse<Project>>
  delete(id: string): Promise<APIResponse<void>>
  getMembers(id: string): Promise<APIResponse<User[]>>
  addMember(projectId: string, userId: string): Promise<APIResponse<void>>
  removeMember(projectId: string, userId: string): Promise<APIResponse<void>>
}

export interface TasksAPI {
  getAll(params?: SearchParams & { projectId?: string }): Promise<APIResponse<Task[]>>
  getById(id: string): Promise<APIResponse<Task>>
  create(data: CreateTaskForm): Promise<APIResponse<Task>>
  update(id: string, data: Partial<Task>): Promise<APIResponse<Task>>
  delete(id: string): Promise<APIResponse<void>>
  addAttachment(taskId: string, file: File): Promise<APIResponse<Attachment>>
  removeAttachment(taskId: string, attachmentId: string): Promise<APIResponse<void>>
}

export interface UsersAPI {
  getAll(params?: SearchParams): Promise<APIResponse<User[]>>
  getById(id: string): Promise<APIResponse<User>>
  update(id: string, data: Partial<User>): Promise<APIResponse<User>>
  updatePreferences(id: string, preferences: Partial<UserPreferences>): Promise<APIResponse<User>>
  getProfile(): Promise<APIResponse<User>>
  updateProfile(data: UserProfileForm): Promise<APIResponse<User>>
}

export interface AnalyticsAPI {
  getCurrent(period: Analytics['period']): Promise<APIResponse<Analytics>>
  getHistory(params?: { period?: Analytics['period']; limit?: number }): Promise<APIResponse<Analytics[]>>
  getMetrics(type: 'users' | 'projects' | 'tasks' | 'performance'): Promise<APIResponse<any>>
}

// WebSocket Types
export interface WebSocketMessage {
  type: string
  payload: any
  timestamp: string
}

export interface RealTimeUpdate {
  entity: 'project' | 'task' | 'user' | 'notification'
  action: 'created' | 'updated' | 'deleted'
  data: any
  userId?: string
}

export { APIResponse }`

    const apiTypesPath = join(typesDir, 'api.ts')
    writeFileSync(apiTypesPath, apiTypes)
    this.generatedFiles.push(apiTypesPath)
  }

  /**
   * Zustand ストア生成
   */
  private async generateZustandStores(): Promise<void> {
    const storeDir = join(this.projectRoot, 'lib', 'store')
    this.ensureDirectoryExists(storeDir)

    // メインストア
    const mainStore = `import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { AppState, StoreActions } from '../types'
import { createUserSlice } from './slices/userSlice'
import { createProjectSlice } from './slices/projectSlice'
import { createTaskSlice } from './slices/taskSlice'
import { createNotificationSlice } from './slices/notificationSlice'
import { createAnalyticsSlice } from './slices/analyticsSlice'
import { createUISlice } from './slices/uiSlice'

export type AppStore = AppState & StoreActions

// Initial State
const initialState: AppState = {
  user: {
    current: null,
    isAuthenticated: false,
    permissions: []
  },
  projects: {
    items: [],
    currentProject: null,
    loading: false,
    error: null
  },
  tasks: {
    items: [],
    currentTask: null,
    loading: false,
    error: null
  },
  users: {
    items: [],
    loading: false,
    error: null
  },
  notifications: {
    items: [],
    unreadCount: 0,
    loading: false
  },
  analytics: {
    current: null,
    history: [],
    loading: false,
    error: null
  },
  ui: {
    sidebar: {
      collapsed: false,
      activeSection: 'dashboard'
    },
    modals: {},
    loading: {},
    errors: {},
    filters: {
      projects: {
        status: [],
        priority: [],
        owner: [],
        tags: [],
        dateRange: {}
      },
      tasks: {
        status: [],
        priority: [],
        assignee: [],
        project: [],
        tags: [],
        dateRange: {}
      },
      users: {
        role: [],
        status: [],
        lastLogin: {}
      }
    },
    search: {
      query: '',
      results: [],
      isSearching: false
    }
  }
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          ...initialState,
          
          // Combine all slice actions
          ...createUserSlice(set, get),
          ...createProjectSlice(set, get),
          ...createTaskSlice(set, get),
          ...createNotificationSlice(set, get),
          ...createAnalyticsSlice(set, get),
          ...createUISlice(set, get),
        }))
      ),
      {
        name: 'matura-app-store',
        partialize: (state) => ({
          user: {
            current: state.user.current,
            isAuthenticated: state.user.isAuthenticated,
            permissions: state.user.permissions
          },
          ui: {
            sidebar: state.ui.sidebar,
            filters: state.ui.filters
          }
        })
      }
    ),
    { name: 'MATURAStore' }
  )
)

// Selectors
export const useUser = () => useAppStore((state) => state.user)
export const useProjects = () => useAppStore((state) => state.projects)
export const useTasks = () => useAppStore((state) => state.tasks)
export const useNotifications = () => useAppStore((state) => state.notifications)
export const useAnalytics = () => useAppStore((state) => state.analytics)
export const useUI = () => useAppStore((state) => state.ui)

// Action selectors
export const useUserActions = () => useAppStore((state) => ({
  setCurrentUser: state.setCurrentUser,
  updateUserPreferences: state.updateUserPreferences,
  logout: state.logout
}))

export const useProjectActions = () => useAppStore((state) => ({
  addProject: state.addProject,
  updateProject: state.updateProject,
  deleteProject: state.deleteProject,
  setCurrentProject: state.setCurrentProject,
  fetchProjects: state.fetchProjects
}))

export const useTaskActions = () => useAppStore((state) => ({
  addTask: state.addTask,
  updateTask: state.updateTask,
  deleteTask: state.deleteTask,
  setCurrentTask: state.setCurrentTask,
  fetchTasks: state.fetchTasks
}))

export const useNotificationActions = () => useAppStore((state) => ({
  addNotification: state.addNotification,
  markNotificationAsRead: state.markNotificationAsRead,
  markAllNotificationsAsRead: state.markAllNotificationsAsRead,
  removeNotification: state.removeNotification
}))

export const useUIActions = () => useAppStore((state) => ({
  toggleSidebar: state.toggleSidebar,
  setActiveSection: state.setActiveSection,
  openModal: state.openModal,
  closeModal: state.closeModal,
  setLoading: state.setLoading,
  setError: state.setError,
  updateFilters: state.updateFilters,
  setSearchQuery: state.setSearchQuery,
  setSearchResults: state.setSearchResults
}))

// Type-safe store hook
export const useStore = <T>(selector: (state: AppStore) => T): T =>
  useAppStore(selector)`

    const mainStorePath = join(storeDir, 'index.ts')
    writeFileSync(mainStorePath, mainStore)
    this.generatedFiles.push(mainStorePath)

    // スライス用ディレクトリ
    const slicesDir = join(storeDir, 'slices')
    this.ensureDirectoryExists(slicesDir)

    // User Slice
    const userSlice = `import { StateCreator } from 'zustand'
import { AppStore } from '../index'
import { User, UserPreferences } from '../../types'
import { apiClient } from '../../api/client'

export interface UserSlice {
  setCurrentUser: (user: User | null) => void
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void
  logout: () => void
}

export const createUserSlice: StateCreator<
  AppStore,
  [['zustand/immer', never], ['zustand/devtools', never]],
  [],
  UserSlice
> = (set, get) => ({
  setCurrentUser: (user) => {
    set((state) => {
      state.user.current = user
      state.user.isAuthenticated = !!user
      if (user) {
        state.user.permissions = user.role === 'admin' ? ['all'] : ['read', 'write']
      } else {
        state.user.permissions = []
      }
    })
    
    console.log('✅ User set:', user?.name || 'Logged out')
  },

  updateUserPreferences: async (preferences) => {
    const currentUser = get().user.current
    if (!currentUser) return

    set((state) => {
      state.ui.loading.userPreferences = true
    })

    try {
      const updatedUser = {
        ...currentUser,
        preferences: { ...currentUser.preferences, ...preferences }
      }

      // API call
      await apiClient.users.updatePreferences(currentUser.id, preferences)

      set((state) => {
        if (state.user.current) {
          state.user.current.preferences = updatedUser.preferences
        }
        state.ui.loading.userPreferences = false
      })

      console.log('✅ User preferences updated:', preferences)
    } catch (error) {
      set((state) => {
        state.ui.errors.userPreferences = error instanceof Error ? error.message : 'Failed to update preferences'
        state.ui.loading.userPreferences = false
      })
      console.error('❌ Failed to update user preferences:', error)
    }
  },

  logout: () => {
    set((state) => {
      state.user.current = null
      state.user.isAuthenticated = false
      state.user.permissions = []
      // Clear sensitive data
      state.projects.items = []
      state.tasks.items = []
      state.notifications.items = []
    })
    
    console.log('✅ User logged out')
  }
})`

    const userSlicePath = join(slicesDir, 'userSlice.ts')
    writeFileSync(userSlicePath, userSlice)
    this.generatedFiles.push(userSlicePath)

    // Project Slice
    const projectSlice = `import { StateCreator } from 'zustand'
import { AppStore } from '../index'
import { Project } from '../../types'
import { apiClient } from '../../api/client'
import { generateId } from '../../utils'

export interface ProjectSlice {
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  setCurrentProject: (project: Project | null) => void
  fetchProjects: () => Promise<void>
}

export const createProjectSlice: StateCreator<
  AppStore,
  [['zustand/immer', never], ['zustand/devtools', never]],
  [],
  ProjectSlice
> = (set, get) => ({
  addProject: async (projectData) => {
    set((state) => {
      state.projects.loading = true
      state.projects.error = null
    })

    try {
      const newProject: Project = {
        ...projectData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Optimistic update
      set((state) => {
        state.projects.items.push(newProject)
      })

      // API call
      const response = await apiClient.projects.create(projectData)
      
      if (response.success && response.data) {
        set((state) => {
          const index = state.projects.items.findIndex(p => p.id === newProject.id)
          if (index !== -1) {
            state.projects.items[index] = response.data!
          }
          state.projects.loading = false
        })

        get().addNotification({
          type: 'success',
          title: 'Project Created',
          message: \`Project "\${newProject.name}" has been created successfully\`,
          read: false
        })

        console.log('✅ Project added:', newProject.name)
      }
    } catch (error) {
      // Rollback optimistic update
      set((state) => {
        state.projects.items = state.projects.items.filter(p => p.id !== newProject.id)
        state.projects.error = error instanceof Error ? error.message : 'Failed to create project'
        state.projects.loading = false
      })

      console.error('❌ Failed to add project:', error)
    }
  },

  updateProject: async (id, updates) => {
    set((state) => {
      state.projects.loading = true
      state.projects.error = null
    })

    try {
      const updatedProject = {
        ...updates,
        updatedAt: new Date().toISOString()
      }

      // Optimistic update
      set((state) => {
        const index = state.projects.items.findIndex(p => p.id === id)
        if (index !== -1) {
          Object.assign(state.projects.items[index], updatedProject)
        }
        if (state.projects.currentProject?.id === id) {
          Object.assign(state.projects.currentProject, updatedProject)
        }
      })

      // API call
      const response = await apiClient.projects.update(id, updates)
      
      if (response.success && response.data) {
        set((state) => {
          const index = state.projects.items.findIndex(p => p.id === id)
          if (index !== -1) {
            state.projects.items[index] = response.data!
          }
          if (state.projects.currentProject?.id === id) {
            state.projects.currentProject = response.data!
          }
          state.projects.loading = false
        })

        console.log('✅ Project updated:', id)
      }
    } catch (error) {
      set((state) => {
        state.projects.error = error instanceof Error ? error.message : 'Failed to update project'
        state.projects.loading = false
      })

      console.error('❌ Failed to update project:', error)
    }
  },

  deleteProject: async (id) => {
    set((state) => {
      state.projects.loading = true
      state.projects.error = null
    })

    try {
      // Optimistic update
      const deletedProject = get().projects.items.find(p => p.id === id)
      set((state) => {
        state.projects.items = state.projects.items.filter(p => p.id !== id)
        if (state.projects.currentProject?.id === id) {
          state.projects.currentProject = null
        }
      })

      // API call
      await apiClient.projects.delete(id)
      
      set((state) => {
        state.projects.loading = false
      })

      get().addNotification({
        type: 'success',
        title: 'Project Deleted',
        message: \`Project "\${deletedProject?.name}" has been deleted\`,
        read: false
      })

      console.log('✅ Project deleted:', id)
    } catch (error) {
      // Could rollback here if needed
      set((state) => {
        state.projects.error = error instanceof Error ? error.message : 'Failed to delete project'
        state.projects.loading = false
      })

      console.error('❌ Failed to delete project:', error)
    }
  },

  setCurrentProject: (project) => {
    set((state) => {
      state.projects.currentProject = project
    })
    console.log('✅ Current project set:', project?.name || 'None')
  },

  fetchProjects: async () => {
    set((state) => {
      state.projects.loading = true
      state.projects.error = null
    })

    try {
      const response = await apiClient.projects.getAll()
      
      if (response.success && response.data) {
        set((state) => {
          state.projects.items = response.data!
          state.projects.loading = false
        })

        console.log('✅ Projects fetched:', response.data.length)
      }
    } catch (error) {
      set((state) => {
        state.projects.error = error instanceof Error ? error.message : 'Failed to fetch projects'
        state.projects.loading = false
      })

      console.error('❌ Failed to fetch projects:', error)
    }
  }
})`

    const projectSlicePath = join(slicesDir, 'projectSlice.ts')
    writeFileSync(projectSlicePath, projectSlice)
    this.generatedFiles.push(projectSlicePath)

    // Task Slice
    const taskSlice = `import { StateCreator } from 'zustand'
import { AppStore } from '../index'
import { Task } from '../../types'
import { apiClient } from '../../api/client'
import { generateId } from '../../utils'

export interface TaskSlice {
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  setCurrentTask: (task: Task | null) => void
  fetchTasks: (projectId?: string) => Promise<void>
}

export const createTaskSlice: StateCreator<
  AppStore,
  [['zustand/immer', never], ['zustand/devtools', never]],
  [],
  TaskSlice
> = (set, get) => ({
  addTask: async (taskData) => {
    set((state) => {
      state.tasks.loading = true
      state.tasks.error = null
    })

    try {
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attachments: []
      }

      // Optimistic update
      set((state) => {
        state.tasks.items.push(newTask)
      })

      // API call
      const response = await apiClient.tasks.create(taskData)
      
      if (response.success && response.data) {
        set((state) => {
          const index = state.tasks.items.findIndex(t => t.id === newTask.id)
          if (index !== -1) {
            state.tasks.items[index] = response.data!
          }
          state.tasks.loading = false
        })

        get().addNotification({
          type: 'success',
          title: 'Task Created',
          message: \`Task "\${newTask.title}" has been created\`,
          read: false
        })

        console.log('✅ Task added:', newTask.title)
      }
    } catch (error) {
      // Rollback optimistic update
      set((state) => {
        state.tasks.items = state.tasks.items.filter(t => t.id !== newTask.id)
        state.tasks.error = error instanceof Error ? error.message : 'Failed to create task'
        state.tasks.loading = false
      })

      console.error('❌ Failed to add task:', error)
    }
  },

  updateTask: async (id, updates) => {
    set((state) => {
      state.tasks.loading = true
      state.tasks.error = null
    })

    try {
      const updatedTask = {
        ...updates,
        updatedAt: new Date().toISOString()
      }

      // Optimistic update
      set((state) => {
        const index = state.tasks.items.findIndex(t => t.id === id)
        if (index !== -1) {
          Object.assign(state.tasks.items[index], updatedTask)
        }
        if (state.tasks.currentTask?.id === id) {
          Object.assign(state.tasks.currentTask, updatedTask)
        }
      })

      // API call
      const response = await apiClient.tasks.update(id, updates)
      
      if (response.success && response.data) {
        set((state) => {
          const index = state.tasks.items.findIndex(t => t.id === id)
          if (index !== -1) {
            state.tasks.items[index] = response.data!
          }
          if (state.tasks.currentTask?.id === id) {
            state.tasks.currentTask = response.data!
          }
          state.tasks.loading = false
        })

        console.log('✅ Task updated:', id)
      }
    } catch (error) {
      set((state) => {
        state.tasks.error = error instanceof Error ? error.message : 'Failed to update task'
        state.tasks.loading = false
      })

      console.error('❌ Failed to update task:', error)
    }
  },

  deleteTask: async (id) => {
    set((state) => {
      state.tasks.loading = true
      state.tasks.error = null
    })

    try {
      // Optimistic update
      const deletedTask = get().tasks.items.find(t => t.id === id)
      set((state) => {
        state.tasks.items = state.tasks.items.filter(t => t.id !== id)
        if (state.tasks.currentTask?.id === id) {
          state.tasks.currentTask = null
        }
      })

      // API call
      await apiClient.tasks.delete(id)
      
      set((state) => {
        state.tasks.loading = false
      })

      get().addNotification({
        type: 'success',
        title: 'Task Deleted',
        message: \`Task "\${deletedTask?.title}" has been deleted\`,
        read: false
      })

      console.log('✅ Task deleted:', id)
    } catch (error) {
      set((state) => {
        state.tasks.error = error instanceof Error ? error.message : 'Failed to delete task'
        state.tasks.loading = false
      })

      console.error('❌ Failed to delete task:', error)
    }
  },

  setCurrentTask: (task) => {
    set((state) => {
      state.tasks.currentTask = task
    })
    console.log('✅ Current task set:', task?.title || 'None')
  },

  fetchTasks: async (projectId) => {
    set((state) => {
      state.tasks.loading = true
      state.tasks.error = null
    })

    try {
      const response = await apiClient.tasks.getAll({ projectId })
      
      if (response.success && response.data) {
        set((state) => {
          if (projectId) {
            // Filter tasks for specific project
            state.tasks.items = state.tasks.items.filter(t => t.projectId !== projectId)
            state.tasks.items.push(...response.data!)
          } else {
            state.tasks.items = response.data!
          }
          state.tasks.loading = false
        })

        console.log('✅ Tasks fetched:', response.data.length, projectId ? \`for project \${projectId}\` : 'all')
      }
    } catch (error) {
      set((state) => {
        state.tasks.error = error instanceof Error ? error.message : 'Failed to fetch tasks'
        state.tasks.loading = false
      })

      console.error('❌ Failed to fetch tasks:', error)
    }
  }
})`

    const taskSlicePath = join(slicesDir, 'taskSlice.ts')
    writeFileSync(taskSlicePath, taskSlice)
    this.generatedFiles.push(taskSlicePath)

    // 残りのスライスも簡略化して生成
    const notificationSlice = `import { StateCreator } from 'zustand'
import { AppStore } from '../index'
import { Notification } from '../../types'
import { generateId } from '../../utils'

export interface NotificationSlice {
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  removeNotification: (id: string) => void
}

export const createNotificationSlice: StateCreator<
  AppStore,
  [['zustand/immer', never], ['zustand/devtools', never]],
  [],
  NotificationSlice
> = (set, get) => ({
  addNotification: (notificationData) => {
    const notification: Notification = {
      ...notificationData,
      id: generateId(),
      createdAt: new Date().toISOString()
    }

    set((state) => {
      state.notifications.items.unshift(notification)
      if (!notification.read) {
        state.notifications.unreadCount += 1
      }
    })

    console.log('✅ Notification added:', notification.title)
  },

  markNotificationAsRead: (id) => {
    set((state) => {
      const notification = state.notifications.items.find(n => n.id === id)
      if (notification && !notification.read) {
        notification.read = true
        state.notifications.unreadCount = Math.max(0, state.notifications.unreadCount - 1)
      }
    })
    console.log('✅ Notification marked as read:', id)
  },

  markAllNotificationsAsRead: () => {
    set((state) => {
      state.notifications.items.forEach(notification => {
        notification.read = true
      })
      state.notifications.unreadCount = 0
    })
    console.log('✅ All notifications marked as read')
  },

  removeNotification: (id) => {
    set((state) => {
      const index = state.notifications.items.findIndex(n => n.id === id)
      if (index !== -1) {
        const notification = state.notifications.items[index]
        if (!notification.read) {
          state.notifications.unreadCount = Math.max(0, state.notifications.unreadCount - 1)
        }
        state.notifications.items.splice(index, 1)
      }
    })
    console.log('✅ Notification removed:', id)
  }
})`

    const notificationSlicePath = join(slicesDir, 'notificationSlice.ts')
    writeFileSync(notificationSlicePath, notificationSlice)
    this.generatedFiles.push(notificationSlicePath)

    // Analytics Slice と UI Slice も簡略化して追加
    await this.generateRemainingSlices(slicesDir)
  }

  private async generateRemainingSlices(slicesDir: string): Promise<void> {
    // Analytics Slice
    const analyticsSlice = `import { StateCreator } from 'zustand'
import { AppStore } from '../index'
import { Analytics } from '../../types'
import { apiClient } from '../../api/client'

export interface AnalyticsSlice {
  fetchAnalytics: (period: Analytics['period']) => Promise<void>
}

export const createAnalyticsSlice: StateCreator<
  AppStore,
  [['zustand/immer', never], ['zustand/devtools', never]],
  [],
  AnalyticsSlice
> = (set, get) => ({
  fetchAnalytics: async (period) => {
    set((state) => {
      state.analytics.loading = true
      state.analytics.error = null
    })

    try {
      const response = await apiClient.analytics.getCurrent(period)
      
      if (response.success && response.data) {
        set((state) => {
          state.analytics.current = response.data!
          state.analytics.loading = false
        })

        console.log('✅ Analytics fetched for period:', period)
      }
    } catch (error) {
      set((state) => {
        state.analytics.error = error instanceof Error ? error.message : 'Failed to fetch analytics'
        state.analytics.loading = false
      })

      console.error('❌ Failed to fetch analytics:', error)
    }
  }
})`

    const analyticsSlicePath = join(slicesDir, 'analyticsSlice.ts')
    writeFileSync(analyticsSlicePath, analyticsSlice)
    this.generatedFiles.push(analyticsSlicePath)

    // UI Slice
    const uiSlice = `import { StateCreator } from 'zustand'
import { AppStore } from '../index'
import { UIState, SearchResult } from '../../types'

export interface UISlice {
  toggleSidebar: () => void
  setActiveSection: (section: string) => void
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  setLoading: (key: string, loading: boolean) => void
  setError: (key: string, error: string | null) => void
  updateFilters: <T extends keyof UIState['filters']>(type: T, filters: Partial<UIState['filters'][T]>) => void
  setSearchQuery: (query: string) => void
  setSearchResults: (results: SearchResult[]) => void
}

export const createUISlice: StateCreator<
  AppStore,
  [['zustand/immer', never], ['zustand/devtools', never]],
  [],
  UISlice
> = (set, get) => ({
  toggleSidebar: () => {
    set((state) => {
      state.ui.sidebar.collapsed = !state.ui.sidebar.collapsed
    })
    console.log('✅ Sidebar toggled')
  },

  setActiveSection: (section) => {
    set((state) => {
      state.ui.sidebar.activeSection = section
    })
    console.log('✅ Active section set:', section)
  },

  openModal: (modalId) => {
    set((state) => {
      state.ui.modals[modalId] = true
    })
    console.log('✅ Modal opened:', modalId)
  },

  closeModal: (modalId) => {
    set((state) => {
      state.ui.modals[modalId] = false
    })
    console.log('✅ Modal closed:', modalId)
  },

  setLoading: (key, loading) => {
    set((state) => {
      state.ui.loading[key] = loading
    })
  },

  setError: (key, error) => {
    set((state) => {
      state.ui.errors[key] = error
    })
  },

  updateFilters: (type, filters) => {
    set((state) => {
      Object.assign(state.ui.filters[type], filters)
    })
    console.log('✅ Filters updated:', type, filters)
  },

  setSearchQuery: (query) => {
    set((state) => {
      state.ui.search.query = query
      if (!query) {
        state.ui.search.results = []
      }
    })
  },

  setSearchResults: (results) => {
    set((state) => {
      state.ui.search.results = results
      state.ui.search.isSearching = false
    })
    console.log('✅ Search results updated:', results.length, 'results')
  }
})`

    const uiSlicePath = join(slicesDir, 'uiSlice.ts')
    writeFileSync(uiSlicePath, uiSlice)
    this.generatedFiles.push(uiSlicePath)
  }

  /**
   * カスタムフック生成
   */
  private async generateStateHooks(): Promise<void> {
    const hooksDir = join(this.projectRoot, 'hooks')
    this.ensureDirectoryExists(hooksDir)

    // メインのフック集
    const hooks = `import { useEffect, useCallback } from 'react'
import { 
  useAppStore, 
  useUser, 
  useProjects, 
  useTasks, 
  useNotifications,
  useUI,
  useUserActions,
  useProjectActions,
  useTaskActions,
  useNotificationActions,
  useUIActions 
} from '@/lib/store'
import { Project, Task, User } from '@/lib/types'

// ===== User Hooks =====

export const useAuth = () => {
  const user = useUser()
  const { setCurrentUser, logout } = useUserActions()

  const login = useCallback(async (email: string, password: string) => {
    try {
      // Mock authentication
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email,
        role: 'admin',
        createdAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          language: 'ja',
          notifications: {
            email: true,
            push: true,
            inApp: true
          },
          dashboard: {
            layout: 'grid',
            itemsPerPage: 20
          }
        }
      }
      
      setCurrentUser(mockUser)
      console.log('✅ User logged in:', mockUser.name)
    } catch (error) {
      console.error('❌ Login failed:', error)
      throw error
    }
  }, [setCurrentUser])

  return {
    ...user,
    login,
    logout
  }
}

export const useCurrentUser = () => {
  const user = useUser()
  return user.current
}

// ===== Project Hooks =====

export const useProjectList = () => {
  const projects = useProjects()
  const { fetchProjects } = useProjectActions()

  useEffect(() => {
    if (projects.items.length === 0 && !projects.loading) {
      fetchProjects()
    }
  }, [projects.items.length, projects.loading, fetchProjects])

  return projects
}

export const useProject = (projectId?: string) => {
  const projects = useProjects()
  const { setCurrentProject } = useProjectActions()

  const project = projectId 
    ? projects.items.find(p => p.id === projectId) || null
    : projects.currentProject

  useEffect(() => {
    if (projectId && project && project.id !== projects.currentProject?.id) {
      setCurrentProject(project)
    }
  }, [projectId, project, projects.currentProject?.id, setCurrentProject])

  return project
}

export const useProjectTasks = (projectId: string) => {
  const tasks = useTasks()
  const { fetchTasks } = useTaskActions()

  const projectTasks = tasks.items.filter(task => task.projectId === projectId)

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId)
    }
  }, [projectId, fetchTasks])

  return {
    tasks: projectTasks,
    loading: tasks.loading,
    error: tasks.error
  }
}

// ===== Task Hooks =====

export const useTaskList = (filters?: { projectId?: string; status?: string }) => {
  const tasks = useTasks()
  const { fetchTasks } = useTaskActions()

  const filteredTasks = tasks.items.filter(task => {
    if (filters?.projectId && task.projectId !== filters.projectId) return false
    if (filters?.status && task.status !== filters.status) return false
    return true
  })

  useEffect(() => {
    if (tasks.items.length === 0 && !tasks.loading) {
      fetchTasks(filters?.projectId)
    }
  }, [tasks.items.length, tasks.loading, filters?.projectId, fetchTasks])

  return {
    ...tasks,
    items: filteredTasks
  }
}

export const useTask = (taskId?: string) => {
  const tasks = useTasks()
  const { setCurrentTask } = useTaskActions()

  const task = taskId 
    ? tasks.items.find(t => t.id === taskId) || null
    : tasks.currentTask

  useEffect(() => {
    if (taskId && task && task.id !== tasks.currentTask?.id) {
      setCurrentTask(task)
    }
  }, [taskId, task, tasks.currentTask?.id, setCurrentTask])

  return task
}

// ===== Notification Hooks =====

export const useNotificationList = () => {
  const notifications = useNotifications()
  
  return {
    ...notifications,
    hasUnread: notifications.unreadCount > 0
  }
}

export const useToast = () => {
  const { addNotification } = useNotificationActions()

  const toast = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string
  ) => {
    addNotification({
      type,
      title,
      message: message || '',
      read: false
    })
  }, [addNotification])

  return {
    success: (title: string, message?: string) => toast('success', title, message),
    error: (title: string, message?: string) => toast('error', title, message),
    warning: (title: string, message?: string) => toast('warning', title, message),
    info: (title: string, message?: string) => toast('info', title, message)
  }
}

// ===== UI Hooks =====

export const useSidebar = () => {
  const ui = useUI()
  const { toggleSidebar, setActiveSection } = useUIActions()

  return {
    collapsed: ui.sidebar.collapsed,
    activeSection: ui.sidebar.activeSection,
    toggle: toggleSidebar,
    setActive: setActiveSection
  }
}

export const useModal = (modalId: string) => {
  const ui = useUI()
  const { openModal, closeModal } = useUIActions()

  return {
    isOpen: ui.modals[modalId] || false,
    open: () => openModal(modalId),
    close: () => closeModal(modalId)
  }
}

export const useLoading = (key: string) => {
  const ui = useUI()
  const { setLoading } = useUIActions()

  return {
    isLoading: ui.loading[key] || false,
    setLoading: (loading: boolean) => setLoading(key, loading)
  }
}

export const useError = (key: string) => {
  const ui = useUI()
  const { setError } = useUIActions()

  return {
    error: ui.errors[key] || null,
    setError: (error: string | null) => setError(key, error),
    clearError: () => setError(key, null)
  }
}

// ===== Search Hook =====

export const useSearch = () => {
  const ui = useUI()
  const { setSearchQuery, setSearchResults } = useUIActions()

  const search = useCallback(async (query: string) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    // Mock search implementation
    const projects = useAppStore.getState().projects.items
    const tasks = useAppStore.getState().tasks.items
    
    const results = [
      ...projects
        .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        .map(p => ({
          type: 'project' as const,
          id: p.id,
          title: p.name,
          description: p.description,
          url: \`/projects/\${p.id}\`,
          relevance: 1
        })),
      ...tasks
        .filter(t => t.title.toLowerCase().includes(query.toLowerCase()))
        .map(t => ({
          type: 'task' as const,
          id: t.id,
          title: t.title,
          description: t.description,
          url: \`/tasks/\${t.id}\`,
          relevance: 1
        }))
    ]

    setSearchResults(results)
    console.log('✅ Search completed:', query, results.length, 'results')
  }, [setSearchQuery, setSearchResults])

  return {
    query: ui.search.query,
    results: ui.search.results,
    isSearching: ui.search.isSearching,
    search
  }
}

// ===== Persistence Hook =====

export const usePersistence = () => {
  const clearStore = useCallback(() => {
    localStorage.removeItem('matura-app-store')
    window.location.reload()
  }, [])

  const exportData = useCallback(() => {
    const state = useAppStore.getState()
    const exportData = {
      projects: state.projects.items,
      tasks: state.tasks.items,
      user: state.user.current,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = \`matura-data-\${new Date().toISOString().split('T')[0]}.json\`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  return {
    clearStore,
    exportData
  }
}`

    const hooksPath = join(hooksDir, 'useStore.ts')
    writeFileSync(hooksPath, hooks)
    this.generatedFiles.push(hooksPath)
  }

  /**
   * 永続化設定生成
   */
  private async generatePersistenceConfig(): Promise<void> {
    const utilsDir = join(this.projectRoot, 'lib', 'utils')
    this.ensureDirectoryExists(utilsDir)

    const persistence = `import { PersistOptions } from 'zustand/middleware'
import { AppStore } from '../store'

// Persistence configuration for the store
export const persistConfig: PersistOptions<AppStore> = {
  name: 'matura-app-store',
  
  // Only persist specific parts of the state
  partialize: (state) => ({
    user: {
      current: state.user.current,
      isAuthenticated: state.user.isAuthenticated,
      permissions: state.user.permissions
    },
    ui: {
      sidebar: state.ui.sidebar,
      filters: state.ui.filters
    }
  }),

  // Custom serialization/deserialization
  serialize: (state) => {
    try {
      return JSON.stringify(state)
    } catch (error) {
      console.error('Failed to serialize state:', error)
      return '{}'
    }
  },

  deserialize: (str) => {
    try {
      return JSON.parse(str)
    } catch (error) {
      console.error('Failed to deserialize state:', error)
      return {}
    }
  },

  // Migration function for store updates
  migrate: (persistedState: any, version: number) => {
    console.log('Migrating store from version:', version)
    
    // Add migration logic here if needed
    return persistedState
  },

  // Version for migration
  version: 1,

  // Storage options
  storage: {
    getItem: (name) => {
      try {
        return localStorage.getItem(name)
      } catch (error) {
        console.error('Failed to get item from localStorage:', error)
        return null
      }
    },
    setItem: (name, value) => {
      try {
        localStorage.setItem(name, value)
      } catch (error) {
        console.error('Failed to set item in localStorage:', error)
      }
    },
    removeItem: (name) => {
      try {
        localStorage.removeItem(name)
      } catch (error) {
        console.error('Failed to remove item from localStorage:', error)
      }
    }
  }
}

// Utility to clear persisted data
export const clearPersistedData = () => {
  try {
    localStorage.removeItem('matura-app-store')
    console.log('✅ Persisted data cleared')
  } catch (error) {
    console.error('❌ Failed to clear persisted data:', error)
  }
}

// Utility to check storage quota
export const checkStorageQuota = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate()
      const used = estimate.usage || 0
      const quota = estimate.quota || 0
      const usagePercentage = quota > 0 ? (used / quota) * 100 : 0

      console.log('Storage usage:', {
        used: Math.round(used / 1024 / 1024 * 100) / 100 + ' MB',
        quota: Math.round(quota / 1024 / 1024 * 100) / 100 + ' MB',
        percentage: Math.round(usagePercentage * 100) / 100 + '%'
      })

      return { used, quota, usagePercentage }
    } catch (error) {
      console.error('Failed to check storage quota:', error)
      return null
    }
  }
  return null
}`

    const persistencePath = join(utilsDir, 'persistence.ts')
    writeFileSync(persistencePath, persistence)
    this.generatedFiles.push(persistencePath)
  }

  /**
   * 状態管理ユーティリティ生成
   */
  private async generateStateUtilities(): Promise<void> {
    const utilsDir = join(this.projectRoot, 'lib', 'utils')
    this.ensureDirectoryExists(utilsDir)

    const stateUtils = `// State Management Utilities

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36)
}

export const createOptimisticUpdate = <T extends { id: string }>(
  items: T[],
  newItem: T
): T[] => {
  return [...items, newItem]
}

export const updateOptimisticItem = <T extends { id: string }>(
  items: T[],
  id: string,
  updates: Partial<T>
): T[] => {
  return items.map(item => 
    item.id === id ? { ...item, ...updates } : item
  )
}

export const removeOptimisticItem = <T extends { id: string }>(
  items: T[],
  id: string
): T[] => {
  return items.filter(item => item.id !== id)
}

export const rollbackOptimisticUpdate = <T extends { id: string }>(
  items: T[],
  tempId: string
): T[] => {
  return items.filter(item => item.id !== tempId)
}

export const debounceAction = <T extends (...args: any[]) => any>(
  action: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => action(...args), delay)
  }
}

export const throttleAction = <T extends (...args: any[]) => any>(
  action: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastExecuted = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastExecuted >= delay) {
      action(...args)
      lastExecuted = now
    }
  }
}

export const createAsyncAction = <T, R>(
  action: (payload: T) => Promise<R>,
  options: {
    onStart?: () => void
    onSuccess?: (result: R) => void
    onError?: (error: Error) => void
    onFinally?: () => void
  } = {}
) => {
  return async (payload: T): Promise<R | undefined> => {
    try {
      options.onStart?.()
      const result = await action(payload)
      options.onSuccess?.(result)
      return result
    } catch (error) {
      options.onError?.(error as Error)
      throw error
    } finally {
      options.onFinally?.()
    }
  }
}

export const validateStateUpdate = <T>(
  currentState: T,
  updates: Partial<T>,
  validator?: (state: T) => boolean
): boolean => {
  const newState = { ...currentState, ...updates }
  return validator ? validator(newState) : true
}

export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
  if (typeof obj === 'object') {
    const clonedObj = {} as { [key: string]: any }
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj as T
  }
  return obj
}

export const createStateSlice = <T>(
  initialState: T,
  name: string
) => {
  return {
    getInitialState: () => deepClone(initialState),
    resetState: (setState: (state: any) => void) => {
      setState((state: any) => {
        state[name] = deepClone(initialState)
      })
    }
  }
}`

    const stateUtilsPath = join(utilsDir, 'stateUtils.ts')
    writeFileSync(stateUtilsPath, stateUtils)
    this.generatedFiles.push(stateUtilsPath)
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true })
    }
  }

  getGeneratedFiles(): string[] {
    return this.generatedFiles
  }
}

export default StateManagementGenerator