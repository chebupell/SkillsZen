import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'

import type { UserSession } from '../types/UserTypes'
import type { ChatMessage } from '../types/chatTypes'
import { AuthProvider, useAuth } from '../services/AuthContext'
import { userStorageService } from '../services/userService'
import { getChatHistoryFirebase, saveChatHistoryFirebase } from '../services/firebase'

vi.mock('../services/userService', () => ({
  userStorageService: {
    getSession: vi.fn(),
    clearSession: vi.fn(),
    updateChatInStorage: vi.fn(),
    updateTaskInStorage: vi.fn(),
  },
}))

vi.mock('../services/firebase', () => ({
  getChatHistoryFirebase: vi.fn(),
  saveChatHistoryFirebase: vi.fn(),
  updateTaskStatusFirebase: vi.fn(),
}))

describe('AuthContext', () => {
  const mockSession: UserSession = {
    uid: 'user_123',
    email: 'test@example.com',
    accessToken: 'secret_token_abc',
    lastLogin: '2023-10-27T10:00:00Z',
    name: 'John Doe',
    photo: 'https://example.com',
  }

  const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getChatHistoryFirebase).mockResolvedValue([])
  })

  it('initializes with session and syncs chat history', async () => {
    const mockHistory: ChatMessage[] = [{ role: 'user', content: 'Hello' }]
    
    vi.mocked(userStorageService.getSession).mockReturnValue(mockSession)
    vi.mocked(getChatHistoryFirebase).mockResolvedValue(mockHistory)
    vi.mocked(userStorageService.updateChatInStorage).mockReturnValue({
      ...mockSession,
      chatHistory: mockHistory
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toEqual(mockSession)
    
    await waitFor(() => {
      expect(getChatHistoryFirebase).toHaveBeenCalledWith(mockSession.uid)
      expect(result.current.user?.chatHistory).toEqual(mockHistory)
    })
  })

  it('updates chat history correctly', async () => {
    vi.mocked(userStorageService.getSession).mockReturnValue(mockSession)
    const { result } = renderHook(() => useAuth(), { wrapper })

    const newMessages: ChatMessage[] = [{ role: 'user', content: 'New message' }]
    
    await act(async () => {
      await result.current.updateChat(newMessages)
    })

    expect(saveChatHistoryFirebase).toHaveBeenCalledWith(mockSession.uid, newMessages)
    expect(userStorageService.updateChatInStorage).toHaveBeenCalledWith(newMessages)
  })

  it('handles loading state during history sync', async () => {
    vi.mocked(userStorageService.getSession).mockReturnValue(mockSession)
    
    let resolveSync: (val: ChatMessage[]) => void = () => {}
    const promise = new Promise<ChatMessage[]>((resolve) => { 
      resolveSync = resolve 
    })
    
    vi.mocked(getChatHistoryFirebase).mockReturnValue(promise)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(true))

    await act(async () => {
      resolveSync([])
      await promise
    })

    expect(result.current.isLoading).toBe(false)
  })

  it('clears state on logout', () => {
    vi.mocked(userStorageService.getSession).mockReturnValue(mockSession)
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(userStorageService.clearSession).toHaveBeenCalled()
  })
})


