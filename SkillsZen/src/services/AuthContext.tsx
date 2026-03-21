import { createContext, useContext, useState, type ReactNode } from 'react'
import { userStorageService } from './userService'
import type { UserSession } from '../types/types'

interface AuthContextType {
  user: UserSession | null
  isAuthenticated: boolean
  login: (session: UserSession) => void
  logout: () => void
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
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
