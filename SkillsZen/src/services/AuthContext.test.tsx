import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import { userStorageService } from './userService'
import type { UserSession } from '../types/types'
import type { ReactNode } from 'react'

// 1. Мокаем сервис хранилища
vi.mock('./userService', () => ({
  userStorageService: {
    getSession: vi.fn(),
    clearSession: vi.fn(),
  },
}))

describe('AuthContext', () => {
  // Данные строго по вашему интерфейсу UserSession
  const mockSession: UserSession = {
    uid: 'user_123',
    email: 'test@example.com',
    accessToken: 'secret_token_abc',
    lastLogin: '2023-10-27T10:00:00Z',
    name: 'John Doe',
    photo: 'https://example.com',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Обертка для предоставления контекста в тестах
  const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>

  it('initializes with session from userStorageService', () => {
    // Настраиваем возврат сессии при инициализации
    ;(vi.mocked(userStorageService.getSession) as Mock).mockReturnValue(mockSession)

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toEqual(mockSession)
    expect(result.current.isAuthenticated).toBe(true)
    expect(userStorageService.getSession).toHaveBeenCalledTimes(1)
  })

  it('initializes as unauthenticated if no session exists', () => {
    ;(vi.mocked(userStorageService.getSession) as Mock).mockReturnValue(null)

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('updates state and isAuthenticated when login is called', () => {
    ;(vi.mocked(userStorageService.getSession) as Mock).mockReturnValue(null)
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isAuthenticated).toBe(false)

    act(() => {
      result.current.login(mockSession)
    })

    expect(result.current.user).toEqual(mockSession)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('clears state and calls storage service when logout is called', () => {
    ;(vi.mocked(userStorageService.getSession) as Mock).mockReturnValue(mockSession)
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    // Проверяем, что данные удалены и из localStorage
    expect(userStorageService.clearSession).toHaveBeenCalledTimes(1)
  })

  it('throws error when useAuth is used outside of AuthProvider', () => {
    // Скрываем ошибку в консоли, так как мы намеренно её вызываем
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider')

    consoleSpy.mockRestore()
  })
})
