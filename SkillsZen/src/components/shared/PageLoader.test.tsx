import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageLoader } from './PageLoader'

vi.mock('lucide-react', () => ({
  Loader2: ({ className }: { className: string }) => (
    <svg data-testid="loader-icon" className={className} />
  ),
  Sparkles: ({ className }: { className: string }) => (
    <svg data-testid="sparkles-icon" className={className} />
  ),
}))

describe('PageLoader', () => {
  it('renders correctly with all main elements', () => {
    render(<PageLoader />)

    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument()

    expect(screen.getByText(/skillszen engine/i)).toBeInTheDocument()

    const loadingImage = screen.getByAltText(/loading\.\.\./i)
    expect(loadingImage).toBeInTheDocument()
    expect(loadingImage).toHaveAttribute('src', '/background-images/main-page-background.png')
  })

  it('renders the animated icons', () => {
    render(<PageLoader />)

    const loaderIcon = screen.getByTestId('loader-icon')
    const sparklesIcon = screen.getByTestId('sparkles-icon')

    expect(loaderIcon).toBeInTheDocument()
    expect(loaderIcon).toHaveClass('animate-spin')

    expect(sparklesIcon).toBeInTheDocument()
  })

  it('has the correct layout classes for centering', () => {
    const { container } = render(<PageLoader />)
    const overlay = container.firstChild as HTMLElement

    expect(overlay).toHaveClass('fixed', 'inset-0', 'flex', 'items-center', 'justify-center')
  })

  it('contains the progress bar element', () => {
    const { container } = render(<PageLoader />)
    const progressBar = container.querySelector('.animate-progress-loading')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveClass('bg-yellow-400')
  })
})
