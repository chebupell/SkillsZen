import { useNavigate, useLocation, type Location } from 'react-router-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BackButton } from '../components/shared/backButton'

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
}))

describe('BackButton', () => {
  const mockNavigate = vi.fn()
  const mockLocation = (path: string) => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: path,
      search: '',
      hash: '',
      state: null,
      key: 'default',
    } as Location)
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
    localStorage.clear()
    mockLocation('/test')
  })

  it('should contain title "Back" by default', () => {
    render(<BackButton />)
    expect(screen.getByText('Back')).toBeInTheDocument()
  })

  it('should navigate to Home if on a "forceHome" page like /ai-chat', () => {
    mockLocation('/ai-chat')

    render(<BackButton />)
    fireEvent.click(screen.getByRole('button'))

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should navigate to lastCategory from localStorage if available', () => {
    const lastCategory = '/coding-tasks'
    localStorage.setItem('lastCategory', lastCategory)
    mockLocation('/settings')

    render(<BackButton />)
    fireEvent.click(screen.getByRole('button'))

    expect(mockNavigate).toHaveBeenCalledWith(lastCategory)
  })

  it('should apply custom className without type errors', () => {
    const customClass = 'mt-10'
    render(<BackButton className={customClass} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass(customClass)
  })
})


