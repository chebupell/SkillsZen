import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import { signupService } from '../services/firebase'
import { userStorageService } from '../services/userService'
import { AuthPage } from '../pages/auth/authPage'

vi.mock('../services/firebase', () => ({
  signupService: vi.fn(),
}))

vi.mock('../services/userService', () => ({
  userStorageService: {
    saveSession: vi.fn(),
    getSession: vi.fn(),
  },
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const mockLogin = vi.fn()
vi.mock('../services/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}))

describe('AuthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderPage = () =>
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>,
    )

  it('executes full signup flow on success', async () => {
    const user = userEvent.setup({ delay: 10 })

    const mockCred = {
      user: { email: 'test@example.com' },
    } as Awaited<ReturnType<typeof signupService>>

    const mockSess = {
      id: 'session_123',
    } as unknown as ReturnType<typeof userStorageService.getSession>

    vi.mocked(signupService).mockResolvedValue(mockCred)
    vi.mocked(userStorageService.getSession).mockReturnValue(mockSess)

    renderPage()

    const nameInput = screen.getByLabelText(/user name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitBtn = screen.getByRole('button', { name: /create account/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'Valid123!')

    await waitFor(() => {
      expect(submitBtn).toBeEnabled()
    })

    await user.click(submitBtn)

    await waitFor(() => {
      expect(signupService).toHaveBeenCalledWith('test@example.com', 'Valid123!', 'John Doe')

      expect(userStorageService.saveSession).toHaveBeenCalledWith(mockCred)
      expect(mockLogin).toHaveBeenCalledWith(mockSess)
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})
