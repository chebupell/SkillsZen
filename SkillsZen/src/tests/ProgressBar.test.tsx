import '@testing-library/jest-dom/vitest'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgressBarCoding from '../components/shared/ProgressBar'

describe('ProgressBarCoding', () => {
  it('renders the correct progress width', () => {
    const progress = 45
    const { container } = render(<ProgressBarCoding progress={progress} />)

    const innerBar = container.querySelector('.transition-all')
    expect(innerBar).toHaveStyle({ width: `${progress}%` })
    expect(innerBar).toHaveClass('bg-primary')
  })

  it('clamps progress between 0 and 100', () => {
    const { rerender, container } = render(<ProgressBarCoding progress={150} />)
    let innerBar = container.querySelector('.transition-all')
    expect(innerBar).toHaveStyle({ width: '100%' })

    rerender(<ProgressBarCoding progress={-50} />)
    innerBar = container.querySelector('.transition-all')
    expect(innerBar).toHaveStyle({ width: '0%' })
  })

  it('renders the correct height based on the size prop', () => {
    const { rerender, container } = render(<ProgressBarCoding progress={50} size="sm" />)
    const barWrapper = container.querySelector('.w-full.relative.border')
    expect(barWrapper).toHaveClass('h-1.5')

    rerender(<ProgressBarCoding progress={50} size="lg" />)
    expect(barWrapper).toHaveClass('h-3.5')
  })

  describe('Stats and Completion', () => {
    it('shows mastery percentage when showStats is true', () => {
      render(<ProgressBarCoding progress={75} showStats={true} />)
      expect(screen.getByText(/75% Mastery/i)).toBeInTheDocument()
    })

    it('applies completed styles when isCompleted is true', () => {
      const { container } = render(<ProgressBarCoding progress={100} isCompleted={true} />)

      expect(screen.getByText(/Perfect Score/i)).toBeInTheDocument()

      const innerBar = container.querySelector('.transition-all')

      expect(innerBar).toHaveClass('bg-gradient-to-r', 'from-yellow-400')

      const pingDot = container.querySelector('.animate-ping')
      expect(pingDot).toBeInTheDocument()
    })

    it('renders primary colors when not completed', () => {
      const { container } = render(<ProgressBarCoding progress={10} isCompleted={false} />)
      const innerBar = container.querySelector('.transition-all')

      expect(innerBar).toHaveClass('bg-primary')
      expect(screen.queryByText(/Perfect Score/i)).not.toBeInTheDocument()
    })
  })
})
