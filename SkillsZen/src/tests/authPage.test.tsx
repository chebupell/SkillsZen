import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import type { User, UserCredential } from 'firebase/auth'

import { signupService } from '../services/firebase'
import { userStorageService } from '../services/userService'
import { AuthPage } from '../pages/auth/authPage'
import { toast } from 'sonner'
import { useAuth, type AuthContextType } from '../services/AuthContext'
import type { UserSession, ProfileValues } from '../types/UserTypes'

vi.mock('../services/firebase', () => ({
  signupService: vi.fn(),
}))

vi.mock('../services/userService', () => ({
  userStorageService: {
    saveSession: vi.fn(),
    getSession: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn().mockReturnValue('toast-id'),
  },
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../services/AuthContext', () => ({
  useAuth: vi.fn(),
}))

describe('AuthPage', () => {
  const mockedUseAuth = vi.mocked(useAuth)
  const mockedSignup = vi.mocked(signupService)
  const mockedStorage = vi.mocked(userStorageService)

  const VALID_EMAIL = 'test@example.com'
  const VALID_PASSWORD = 'Password123!' // Соответствует всем правилам Zod

  beforeEach(() => {
    vi.clearAllMocks()

    mockedUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      updateTaskStatus: vi.fn().mockResolvedValue(undefined),
      updateChat: vi.fn().mockResolvedValue(undefined),
      setDraftLocal: vi.fn(),
      saveDraftToCloud: vi.fn().mockResolvedValue(undefined),
      resetDraft: vi.fn().mockResolvedValue(undefined),
    } satisfies AuthContextType)
  })

  const renderPage = () =>
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>,
    )

  it('executes full signup flow with strict typing', async () => {
    const user = userEvent.setup()
    const { login } = mockedUseAuth()

    const mockFirebaseUser = {
      uid: 'u1',
      email: VALID_EMAIL,
      displayName: 'John Doe',
    } as unknown as User

    const mockCredential = {
      user: mockFirebaseUser,
      providerId: 'firebase',
      operationType: 'signIn',
    } as unknown as UserCredential

    const mockSignupResponse = {
      ...mockCredential,
      profile: {
        name: 'John Doe',
        country: 'Belarus',
        birthDate: '1990-01-01',
        phone: '+123',
      } as ProfileValues,
    }

    const mockSession: UserSession = {
      uid: 'u1',
      email: VALID_EMAIL,
      accessToken: 'mock-token',
      lastLogin: new Date().toISOString(),
      name: 'John Doe',
      photo: null,
    }

    mockedSignup.mockResolvedValue(mockSignupResponse as unknown as UserCredential)
    mockedStorage.getSession.mockReturnValue(mockSession)

    renderPage()

    const nameInput = await screen.findByPlaceholderText(/john doe/i)
    const emailInput = screen.getByPlaceholderText('name@example.com')
    const passInput = screen.getByPlaceholderText('••••••••')
    const submitBtn = screen.getByRole('button', { name: /create account/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, VALID_EMAIL)
    await user.type(passInput, VALID_PASSWORD)

    await waitFor(() => expect(submitBtn).toBeEnabled())
    await user.click(submitBtn)

    await waitFor(
      () => {
        expect(mockedSignup).toHaveBeenCalledWith(VALID_EMAIL, VALID_PASSWORD, 'John Doe')

        expect(mockedStorage.saveSession).toHaveBeenCalledWith(mockFirebaseUser)

        expect(login).toHaveBeenCalledWith(mockSession)
        expect(toast.success).toHaveBeenCalledWith('Registration successful!', { id: 'toast-id' })
        expect(mockNavigate).toHaveBeenCalledWith('/')
      },
      { timeout: 3000 },
    )
  })

  it('shows error toast on service failure', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Email already in use'
    mockedSignup.mockRejectedValue(new Error(errorMessage))

    renderPage()

    await user.type(await screen.findByPlaceholderText(/john doe/i), 'John Doe')
    await user.type(screen.getByPlaceholderText('name@example.com'), VALID_EMAIL)
    await user.type(screen.getByPlaceholderText('••••••••'), VALID_PASSWORD)

    const submitBtn = screen.getByRole('button', { name: /create account/i })
    await waitFor(() => expect(submitBtn).not.toBeDisabled())
    await user.click(submitBtn)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage, { id: 'toast-id' })
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('prevents submission if name is too short', async () => {
    const user = userEvent.setup()
    renderPage()

    const nameInput = await screen.findByPlaceholderText(/john doe/i)
    const submitBtn = screen.getByRole('button', { name: /create account/i })

    await user.type(nameInput, 'A')

    expect(await screen.findByText(/at least 2 characters/i)).toBeInTheDocument()
    expect(submitBtn).toBeDisabled()
    expect(mockedSignup).not.toHaveBeenCalled()
  })
})
