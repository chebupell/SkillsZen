import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import type { User, UserCredential } from 'firebase/auth'

import { useAuth, type AuthContextType } from '../services/AuthContext'
import { LoginPage } from '../pages/login/loginPage'
import { signinService } from '../services/firebase'
import { toast } from 'sonner'
import type { ProfileValues, UserSession } from '../types/UserTypes'

vi.mock('../services/firebase', () => ({
  signinService: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn().mockReturnValue('toast-id'),
    dismiss: vi.fn(),
  },
}))

vi.mock('../services/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('LoginPage', () => {
  const mockedUseAuth = vi.mocked(useAuth)
  const mockedSignin = vi.mocked(signinService)

  const VALID_EMAIL = 'test@example.com'
  const VALID_PASSWORD = 'Password123!' // Удовлетворяет всем правилам Zod (A, a, 1, !)

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

  const renderLoginPage = () =>
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    it('successful login flow with full data sync', async () => {
    const user = userEvent.setup()
    const { login } = mockedUseAuth()
    const mockFirebaseUser = {
      uid: 'u1',
      email: VALID_EMAIL,
      displayName: 'Test User',
      stsTokenManager: { accessToken: 'token-123' },
      metadata: { lastSignInTime: new Date().toISOString() },
      getIdToken: vi.fn().mockResolvedValue('token-123'),
    } as unknown as User

    mockedSignin.mockResolvedValue({
      user: mockFirebaseUser,
      profile: { 
        name: 'Test User', 
        photo: '', 
        country: 'Belarus',
        birthDate: '1990-01-01',
        phone: '+123' 
      } as ProfileValues,
      credential: { user: mockFirebaseUser } as UserCredential,
    })

    renderLoginPage()

    const loginInput = await screen.findByPlaceholderText('name@example.com')
    const passInput = screen.getByPlaceholderText('••••••••')
    const submitBtn = screen.getByRole('button', { name: /sign in|login/i })

    await user.type(loginInput, VALID_EMAIL)
    await user.type(passInput, VALID_PASSWORD)

    await waitFor(() => {
      expect(submitBtn).toBeEnabled()
    }, { timeout: 2000 })

    // 4. Кликаем по активной кнопке
    await user.click(submitBtn)


    await waitFor(() => {
      expect(mockedSignin).toHaveBeenCalledWith(VALID_EMAIL, VALID_PASSWORD)
      
      expect(login).toHaveBeenCalledWith(
        expect.objectContaining({
          uid: 'u1',
          email: VALID_EMAIL,
        } as Partial<UserSession>)
      )
      
      expect(mockNavigate).toHaveBeenCalledWith('/')
    }, { timeout: 3000 })
  })



  it('displays toast error when signinService fails', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Invalid email or password'
    mockedSignin.mockRejectedValue(new Error(errorMessage))

    renderLoginPage()

    await user.type(screen.getByPlaceholderText('name@example.com'), VALID_EMAIL)
    await user.type(screen.getByPlaceholderText('••••••••'), VALID_PASSWORD)

    const submitBtn = screen.getByRole('button', { name: /sign in|login/i })
    await waitFor(() => expect(submitBtn).not.toBeDisabled())
    await user.click(submitBtn)

    await waitFor(() => {
      expect(mockedSignin).toHaveBeenCalled()
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining(errorMessage))
    })
  })

  it('shows loading state on submit button during submission', async () => {
    const user = userEvent.setup()

    let resolvePromise: (value: { user: User; profile: ProfileValues; credential: UserCredential }) => void
    const pendingPromise = new Promise<{ user: User; profile: ProfileValues; credential: UserCredential }>((resolve) => { 
      resolvePromise = resolve 
    })
    mockedSignin.mockReturnValue(pendingPromise)

    renderLoginPage()

    await user.type(screen.getByPlaceholderText('name@example.com'), VALID_EMAIL)
    await user.type(screen.getByPlaceholderText('••••••••'), VALID_PASSWORD)

    const submitBtn = screen.getByRole('button', { name: /sign in|login/i })
    await waitFor(() => expect(submitBtn).not.toBeDisabled())
    
    await user.click(submitBtn)

    await waitFor(() => {
      const loader = submitBtn.querySelector('.animate-spin')
      expect(loader).toBeInTheDocument()
      expect(submitBtn).toBeDisabled()
    })

    resolvePromise!({ 
      user: { uid: 'u1' } as User, 
      profile: {} as ProfileValues, 
      credential: {} as UserCredential 
    })
  })
})
