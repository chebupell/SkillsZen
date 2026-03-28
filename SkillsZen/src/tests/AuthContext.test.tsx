import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import type { UserSession } from '../types/types'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth } from '../services/AuthContext'
import { userStorageService } from '../services/userService'

vi.mock('../services/userService', () => ({
  userStorageService: {
    getSession: vi.fn(),
    clearSession: vi.fn(),
  },
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

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>

  it('initializes with session from userStorageService', () => {
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
    expect(userStorageService.clearSession).toHaveBeenCalledTimes(1)
  })

  it('throws error when useAuth is used outside of AuthProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider')

    consoleSpy.mockRestore()
  })
})
