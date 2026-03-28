import { createContext, useContext, useState, type ReactNode } from 'react'
import { userStorageService } from './userService'
import type { UserSession } from '../types/types'
import { updateTaskStatusFirebase } from './firebase'

interface AuthContextType {
  user: UserSession | null
  isAuthenticated: boolean
  login: (session: UserSession) => void
  logout: () => void
  updateTaskStatus: (taskId: string, status: 'passed' | 'failed') => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(() => {
    return userStorageService.getSession()
  })

  const login = (session: UserSession) => {
    setUser(session)
  }

  const logout = () => {
    userStorageService.clearSession()
    setUser(null)
  }

  const updateTaskStatus = async (taskId: string, status: 'passed' | 'failed') => {
    if (!user?.uid) return

    try {
      await updateTaskStatusFirebase(user.uid, taskId, status)

      const updatedUser = userStorageService.updateTaskInStorage(taskId, status)

      setUser(updatedUser)
    } catch (error) {
      console.error('Failed to sync task status:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateTaskStatus,
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
