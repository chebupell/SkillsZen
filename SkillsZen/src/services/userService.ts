import { type User } from 'firebase/auth'
import { type ProfileValues, type UserSession } from '../types/UserTypes'
import type { ChatMessage } from '../types/chatTypes'

const STORAGE_KEY = 'auth_user_session'

export const userStorageService = {
  async saveSession(user: User, profile?: ProfileValues): Promise<void> {
    if (!user) throw new Error('No user provided')

    const token = await user.getIdToken()

    const session: UserSession = {
      uid: user.uid,
      email: user.email,
      accessToken: token,
      lastLogin: new Date().toISOString(),
      name: profile?.name ?? user.displayName ?? '',
      photo: profile?.photo ?? user.photoURL ?? '',
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } catch {
      throw new Error('Local storage is unavailable')
    }
  },

  getSession(): UserSession | null {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? (JSON.parse(data) as UserSession) : null
  },

  syncLocalSession(updates: Partial<UserSession>): UserSession | null {
    const session = this.getSession()
    if (session) {
      const updated = { ...session, ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    }
    return null
  },

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEY)
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEY)
  },

  updateTaskInStorage(taskId: string, status: 'passed' | 'failed'): UserSession | null {
    const session = this.getSession()
    if (!session) return null

    const updatedSession: UserSession = {
      ...session,
      completedTasks: {
        ...(session.completedTasks || {}),
        [taskId]: status,
      },
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession))
    return updatedSession
  },

  updateChatInStorage(messages: ChatMessage[]): UserSession | null {
    const session = this.getSession()
    if (!session) return null

    const updatedSession: UserSession = {
      ...session,
      chatHistory: messages,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession))
    return updatedSession
  },
}
