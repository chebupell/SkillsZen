import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'

import type { UserSession } from '../types/UserTypes'
import type { ChatMessage } from '../types/chatTypes'
import { AuthProvider, useAuth } from '../services/AuthContext'
import { userStorageService } from '../services/userService'
import {
  getChatHistoryFirebase,
  updateTaskStatusFirebase,
  saveUserCodeDraft,
  saveChatHistoryFirebase,
} from '../services/firebase'
import { toast } from 'sonner'

vi.mock('../services/userService', () => ({
  userStorageService: {
    getSession: vi.fn(),
    saveSession: vi.fn(),
    clearSession: vi.fn(),
    updateChatInStorage: vi.fn(),
    updateTaskInStorage: vi.fn(),
    updateDraftInStorage: vi.fn(),
  },
}))

vi.mock('../services/firebase', () => ({
  getChatHistoryFirebase: vi.fn(),
  saveChatHistoryFirebase: vi.fn(),
  updateTaskStatusFirebase: vi.fn(),
  saveUserCodeDraft: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    loading: vi.fn(),
  },
}))

describe('AuthContext', () => {
  const mockSession: UserSession = {
    uid: 'user_123',
    email: 'test@example.com',
    accessToken: 'token_abc',
    lastLogin: '2023-10-27T10:00:00Z',
    name: 'John Doe',
    photo: null,
  }

  const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getChatHistoryFirebase).mockResolvedValue([])
  })

  it('initializes with session from storage', async () => {
    vi.mocked(userStorageService.getSession).mockReturnValue(mockSession)
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {})

    expect(result.current.user).toEqual(mockSession)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('syncs chat history from firebase if not present locally', async () => {
    const mockHistory: ChatMessage[] = [{ role: 'user', content: 'Hello' }]
    vi.mocked(userStorageService.getSession).mockReturnValue(mockSession)
    vi.mocked(getChatHistoryFirebase).mockResolvedValue(mockHistory)
    vi.mocked(userStorageService.updateChatInStorage).mockReturnValue({
      ...mockSession,
      chatHistory: mockHistory,
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(getChatHistoryFirebase).toHaveBeenCalledWith(mockSession.uid)
      expect(result.current.user?.chatHistory).toEqual(mockHistory)
    })
  })

  it('updates task status in firebase and local storage', async () => {
    vi.mocked(userStorageService.getSession).mockReturnValue(mockSession)
    vi.mocked(userStorageService.updateTaskInStorage).mockReturnValue({
      ...mockSession,
      completedTasks: { 'task-1': 'passed' },
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.updateTaskStatus('task-1', 'passed')
    })

    expect(updateTaskStatusFirebase).toHaveBeenCalledWith(mockSession.uid, 'task-1', 'passed')
    expect(userStorageService.updateTaskInStorage).toHaveBeenCalledWith('task-1', 'passed')
    expect(result.current.user?.completedTasks?.['task-1']).toBe('passed')
  })

  it('manages code drafts (local and cloud)', async () => {
    vi.mocked(userStorageService.getSession).mockReturnValue(mockSession)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.user?.uid).toBe(mockSession.uid)
    })

    const updatedUser = {
      ...mockSession,
      drafts: { 'task-1': 'const x = 1;' },
    } as UserSession
    vi.mocked(userStorageService.updateDraftInStorage).mockReturnValue(updatedUser)

    await act(async () => {
      result.current.setDraftLocal('task-1', 'const x = 1;')
    })

    expect(userStorageService.updateDraftInStorage).toHaveBeenCalledWith('task-1', 'const x = 1;')

    expect(result.current.user?.uid).toBe(mockSession.uid)

    await act(async () => {
      await result.current.saveDraftToCloud('task-1', 'const x = 1;')
    })

    expect(saveUserCodeDraft).toHaveBeenCalledWith(mockSession.uid, 'task-1', 'const x = 1;')
  })

  it('resets draft correctly', async () => {
    vi.mocked(userStorageService.getSession).mockReturnValue(mockSession)
    vi.mocked(userStorageService.updateDraftInStorage).mockReturnValue({
      ...mockSession,
      drafts: { 'task-1': '' },
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.resetDraft('task-1')
    })

    expect(userStorageService.updateDraftInStorage).toHaveBeenCalledWith('task-1', '')
    expect(saveUserCodeDraft).toHaveBeenCalledWith(mockSession.uid, 'task-1', '')
  })

  it('login sets user session and isAuthenticated to true', async () => {
    vi.mocked(userStorageService.getSession).mockReturnValue(null)
    const { result } = renderHook(() => useAuth(), { wrapper })
    await act(async () => {
      result.current.login(mockSession)
    })
    expect(result.current.user).toEqual(mockSession)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('updates chat history: calls firebase, updates storage and state', async () => {
    vi.mocked(userStorageService.getSession).mockReturnValue(mockSession)

    // Подготавливаем обновленного пользователя, которого вернет хранилище
    const newMessages: ChatMessage[] = [{ role: 'user', content: 'Hello AI' }]
    const updatedUser: UserSession = {
      ...mockSession,
      chatHistory: newMessages,
    }

    vi.mocked(userStorageService.updateChatInStorage).mockReturnValue(updatedUser)

    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.user).not.toBeNull())

    // 2. Вызываем обновление чата
    await act(async () => {
      await result.current.updateChat(newMessages)
    })

    expect(saveChatHistoryFirebase).toHaveBeenCalledWith(mockSession.uid, newMessages)
    expect(userStorageService.updateChatInStorage).toHaveBeenCalledWith(newMessages)
    expect(result.current.user?.chatHistory).toEqual(newMessages)
  })

  it('handles chat sync failure and shows toast error', async () => {
    vi.mocked(userStorageService.getSession).mockReturnValue(mockSession)

    const firestoreError = new Error('Firestore connection lost')
    vi.mocked(saveChatHistoryFirebase).mockRejectedValue(firestoreError)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => expect(result.current.user).not.toBeNull())

    await act(async () => {
      await result.current.updateChat([{ role: 'user', content: 'Fail test' }])
    })

    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining('History sync error: Firestore connection lost'),
    )
  })

  it('does nothing if user is not authenticated', async () => {
    vi.mocked(userStorageService.getSession).mockReturnValue(null)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.updateChat([{ role: 'user', content: 'No user' }])
    })

    // Ни один сервис не должен быть вызван из-за guard clause: if (!user?.uid) return
    expect(saveChatHistoryFirebase).not.toHaveBeenCalled()
    expect(userStorageService.updateChatInStorage).not.toHaveBeenCalled()
  })
})
