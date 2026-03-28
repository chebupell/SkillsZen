import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { RouterProvider, Outlet } from 'react-router-dom'
import { router } from './router'

vi.mock('../services/AuthContext', () => ({
  useAuth: vi.fn(() => ({ isAuthenticated: false })),
}))

vi.mock('../pages/mainPage/mainPage', () => ({
  default: () => (
    <div data-testid="main-layout">
      <Outlet />
    </div>
  ),
}))

vi.mock('../pages/menuPage/menuPage', () => ({ default: () => <div>Menu Page</div> }))
vi.mock('../pages/login/loginPage', () => ({ LoginPage: () => <div>Login Page</div> }))
vi.mock('../pages/auth/authPage', () => ({ AuthPage: () => <div>Signup Page</div> }))

describe('Router Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()
  })

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path)
    return render(<RouterProvider router={router} />)
  }

  it('renders Login Page on /signin', async () => {
    navigateTo('/sign-in')
    expect(await screen.findByText(/login page/i)).toBeInTheDocument()
  })
})
