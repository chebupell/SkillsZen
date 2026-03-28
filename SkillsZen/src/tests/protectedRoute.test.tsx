import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import { useAuth } from '../services/AuthContext'
import { ProtectedRoute } from '../router/protectedRoute'

vi.mock('../services/AuthContext', () => ({
  useAuth: vi.fn(),
}))

type UseAuthReturn = ReturnType<typeof useAuth>

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderProtectedRoute = () =>
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<div>Private Content</div>} />
          </Route>
          <Route path="/sign-in" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    )

  it('redirects to /sign-in when user is NOT authenticated', () => {
    ;(vi.mocked(useAuth) as Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    } as unknown as UseAuthReturn)

    renderProtectedRoute()

    expect(screen.queryByText(/private content/i)).not.toBeInTheDocument()
    expect(screen.getByText(/login page/i)).toBeInTheDocument()
  })

  it('renders private content when user IS authenticated', () => {
    ;(vi.mocked(useAuth) as Mock).mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User', email: 'test@test.com' },
      login: vi.fn(),
      logout: vi.fn(),
    } as unknown as UseAuthReturn)

    renderProtectedRoute()

    expect(screen.getByText(/private content/i)).toBeInTheDocument()
    expect(screen.queryByText(/login page/i)).not.toBeInTheDocument()
  })
})
