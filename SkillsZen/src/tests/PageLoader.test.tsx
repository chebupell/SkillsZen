import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageLoader } from '../components/shared/PageLoader'

vi.mock('lucide-react', () => ({
  Loader2: ({ className }: { className: string }) => (
    <svg data-testid="loader-icon" className={className} />
  ),
  Sparkles: ({ className }: { className: string }) => (
    <svg data-testid="sparkles-icon" className={className} />
  ),
}))

describe('PageLoader', () => {
  it('renders correctly with current branding and elements', () => {
    render(<PageLoader />)
    expect(screen.getByText(/Preparing/i)).toBeInTheDocument()
    expect(screen.getByText(/Skills/i)).toBeInTheDocument()
    expect(screen.getByText(/Zen/i)).toBeInTheDocument()
    expect(screen.getByText(/Elevating Your Potential/i)).toBeInTheDocument()
    const logo = screen.getByAltText(/loading\.\.\./i)
    expect(logo).toHaveAttribute('src', '/fav.png')
  })

  it('verifies animations and icons are present', () => {
    render(<PageLoader />)

    const loaderIcon = screen.getByTestId('loader-icon')
    const sparklesIcon = screen.getByTestId('sparkles-icon')

    expect(loaderIcon).toHaveClass('animate-spin')
    const sparklesContainer = sparklesIcon.closest('div')
    expect(sparklesContainer).toHaveClass('animate-bounce')
  })

  it('has correct overlay and blur styles', () => {
    const { container } = render(<PageLoader />)
    const overlay = container.firstChild as HTMLElement

    expect(overlay).toHaveClass('fixed', 'inset-0', 'flex')
    expect(overlay.className).toMatch(/backdrop-blur-\[2px\]/)
    expect(overlay.className).toMatch(/bg-background\/\d+/)
  })

  it('contains the progress bar with shadow and animation', () => {
    const { container } = render(<PageLoader />)
    const progressFill = container.querySelector('.animate-progress-loading')

    expect(progressFill).toBeInTheDocument()
    expect(progressFill).toHaveClass('bg-primary')
  })

  it('checks for the decorative glow pulse circle', () => {
    const { container } = render(<PageLoader />)
    const pulseCircle = container.querySelector('.animate-pulse[class*="blur-"]')

    expect(pulseCircle).toBeInTheDocument()
    expect(pulseCircle).toHaveClass('bg-primary/20')
  })

  it('verifies glassmorphism on the logo container', () => {
    render(<PageLoader />)
    const logoImg = screen.getByAltText(/loading\.\.\./i)
    const logoContainer = logoImg.closest('div')
    expect(logoContainer).not.toBeNull()
    const container = logoContainer as HTMLElement
    expect(container).toHaveClass('border', 'overflow-hidden')
    expect(container.className).toMatch(/backdrop-blur-/)
    expect(container.className).toMatch(/bg-background\/\d+/)
  })
})
