import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react'
import { toast } from 'sonner'
import { userStorageService } from './userService'
import type { UserSession } from '../types/UserTypes'
import {
  updateTaskStatusFirebase,
  saveChatHistoryFirebase,
  getChatHistoryFirebase,
  saveUserCodeDraft,
} from './firebase'
import type { ChatMessage } from '../types/chatTypes'

export interface AuthContextType {
  user: UserSession | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (session: UserSession) => void
  logout: () => void
  updateTaskStatus: (taskId: string, status: 'passed' | 'failed') => Promise<void>
  updateChat: (messages: ChatMessage[]) => Promise<void>
  setDraftLocal: (taskId: string, code: string) => void
  saveDraftToCloud: (taskId: string, code: string) => Promise<void>
  resetDraft: (taskId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(() => userStorageService.getSession())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const syncHistory = async () => {
      if (user?.uid && !user.chatHistory) {
        setIsLoading(true)
        try {
          const history = await getChatHistoryFirebase(user.uid)
          if (history.length > 0) {
            const updatedUser = userStorageService.updateChatInStorage(history)
            setUser(updatedUser)
          }
        } finally {
          setIsLoading(false)
        }
      }
    }

    syncHistory()
  }, [user?.uid])

  const login = useCallback((session: UserSession) => {
    setUser(session)
  }, [])

  const logout = useCallback(() => {
    userStorageService.clearSession()
    setUser(null)
  }, [])

  const updateTaskStatus = async (taskId: string, status: 'passed' | 'failed') => {
    if (!user?.uid) return
    try {
      await updateTaskStatusFirebase(user.uid, taskId, status)
      const updatedUser = userStorageService.updateTaskInStorage(taskId, status)
      setUser(updatedUser)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Sync failed'
      toast.error(`Task sync error: ${msg}`)
      throw error
    }
  }

  const updateChat = async (messages: ChatMessage[]) => {
    if (!user?.uid) return
    try {
      await saveChatHistoryFirebase(user.uid, messages)
      const updatedUser = userStorageService.updateChatInStorage(messages)
      setUser(updatedUser)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Chat sync failed'
      toast.error(`History sync error: ${msg}`)
    }
  }

  const setDraftLocal = useCallback((taskId: string, code: string) => {
    setUser((prev) => {
      if (prev?.drafts?.[taskId] === code) return prev
      return userStorageService.updateDraftInStorage(taskId, code)
    })
  }, [])

  const saveDraftToCloud = useCallback(
    async (taskId: string, code: string) => {
      if (!user?.uid) return
      await saveUserCodeDraft(user.uid, taskId, code)
    },
    [user?.uid],
  )

  const resetDraft = async (taskId: string) => {
    if (!user?.uid) return
    const updated = userStorageService.updateDraftInStorage(taskId, '')
    if (updated) setUser(updated)
    try {
      await saveUserCodeDraft(user.uid, taskId, '')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Failed to reset cloud draft: ${message}`)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateTaskStatus,
        updateChat,
        saveDraftToCloud,
        setDraftLocal,
        resetDraft,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
