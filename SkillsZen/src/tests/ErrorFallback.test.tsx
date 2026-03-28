import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { ErrorFallback } from '../components/shared/ErrorFallback'

vi.mock('react-router-dom', () => ({
  useRouteError: vi.fn(),
  isRouteErrorResponse: vi.fn(),
}))

describe('ErrorFallback', () => {
  const mockReset = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(isRouteErrorResponse).mockReturnValue(false)
    vi.stubGlobal('location', {
      reload: vi.fn(),
      href: '',
    })
  })

  it('renders standard Error object message', () => {
    const error = new Error('Test technical error')
    render(<ErrorFallback error={error} resetErrorBoundary={mockReset} />)

    expect(screen.getByText('Application Error')).toBeInTheDocument()
    expect(screen.getByText('Test technical error')).toBeInTheDocument()
  })

  it('renders RouteErrorResponse (e.g. 404) correctly', () => {
    const routeError = { status: 404, statusText: 'Not Found' }
    vi.mocked(useRouteError).mockReturnValue(routeError)
    vi.mocked(isRouteErrorResponse).mockReturnValue(true)

    render(<ErrorFallback />)

    expect(screen.getByText('Error 404')).toBeInTheDocument()
    expect(screen.getByText('Not Found')).toBeInTheDocument()
  })

  it('calls resetErrorBoundary when "Try Again" is clicked', async () => {
    const user = userEvent.setup()
    render(<ErrorFallback error={new Error()} resetErrorBoundary={mockReset} />)

    const retryBtn = screen.getByRole('button', { name: /try again/i })
    await user.click(retryBtn)

    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  it('reloads the page if resetErrorBoundary is not provided', async () => {
    const user = userEvent.setup()
    render(<ErrorFallback error={new Error()} />)

    const retryBtn = screen.getByRole('button', { name: /try again/i })
    await user.click(retryBtn)

    expect(window.location.reload).toHaveBeenCalled()
  })

  it('navigates to home when "Home" button is clicked', async () => {
    const user = userEvent.setup()
    render(<ErrorFallback error={new Error()} />)

    const homeBtn = screen.getByRole('button', { name: /home/i })
    await user.click(homeBtn)

    expect(window.location.href).toBe('/')
  })
})
