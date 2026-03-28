import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import { signinService } from '../services/firebase'
import { userStorageService } from '../services/userService'
import { LoginPage } from '../pages/login/loginPage'

vi.mock('../services/firebase', () => ({
  signinService: vi.fn(),
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

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderPage = () =>
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

  it('performs successful login flow', async () => {
    const user = userEvent.setup()

    const mockCredential = { user: { uid: '123' } } as Awaited<ReturnType<typeof signinService>>
    const mockSession = { token: 'abc' } as unknown as ReturnType<
      typeof userStorageService.getSession
    >

    vi.mocked(signinService).mockResolvedValue(mockCredential)
    vi.mocked(userStorageService.getSession).mockReturnValue(mockSession)

    renderPage()

    const emailInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitBtn = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'Password123!')

    await waitFor(() => {
      expect(submitBtn).toBeEnabled()
    })

    await user.click(submitBtn)

    await waitFor(() => {
      expect(signinService).toHaveBeenCalledWith('test@example.com', 'Password123!')
    })

    await waitFor(() => {
      expect(userStorageService.saveSession).toHaveBeenCalledWith(mockCredential)
      expect(mockLogin).toHaveBeenCalledWith(mockSession)
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})
