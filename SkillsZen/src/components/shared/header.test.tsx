import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import { useAuth } from '../../services/AuthContext'
import { Header } from './header'

vi.mock('../../services/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

type UseAuthReturn = ReturnType<typeof useAuth>

describe('Header', () => {
  const mockLogout = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderHeader = () =>
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

  it('renders login and signup buttons when NOT authenticated', () => {
    ;(vi.mocked(useAuth) as Mock).mockReturnValue({
      isAuthenticated: false,
      logout: mockLogout,
      user: null,
      login: vi.fn(),
    } as UseAuthReturn)

    renderHeader()

    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument()
  })

  it('calls logout and navigates to home on logout click', async () => {
    const user = userEvent.setup()

    ;(vi.mocked(useAuth) as Mock).mockReturnValue({
      isAuthenticated: true,
      logout: mockLogout,
      user: { name: 'User', email: 'u@t.com' },
      login: vi.fn(),
    } as unknown as UseAuthReturn)

    renderHeader()

    const logoutBtn = screen.getByRole('button', { name: /logout/i })
    await user.click(logoutBtn)

    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('links to profile page when authenticated', () => {
    ;(vi.mocked(useAuth) as Mock).mockReturnValue({
      isAuthenticated: true,
      user: { name: 'John' },
      logout: mockLogout,
      login: vi.fn(),
    } as unknown as UseAuthReturn)

    renderHeader()

    const profileLink = screen.getByRole('link', { name: /j/i })
    expect(profileLink).toHaveAttribute('href', '/profile')
  })
})
