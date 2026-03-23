import '@testing-library/jest-dom/vitest'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgressBar from './ProgressBar'

describe('ProgressBar', () => {
  it('renders the correct progress width', () => {
    const progress = 45
    const { container } = render(<ProgressBar progress={progress} />)

    const innerBar = container.querySelector('.bg-indigo-600')
    expect(innerBar).toHaveStyle({ width: `${progress}%` })
  })

  it('clamps progress between 0 and 100', () => {
    const { rerender, container } = render(<ProgressBar progress={150} />)
    let innerBar = container.querySelector('.rounded-full > div')
    expect(innerBar).toHaveStyle({ width: '100%' })

    rerender(<ProgressBar progress={-50} />)
    innerBar = container.querySelector('.rounded-full > div')
    expect(innerBar).toHaveStyle({ width: '0%' })
  })

  it('renders the correct height based on the size prop', () => {
    const { rerender, container } = render(<ProgressBar progress={50} size="sm" />)
    expect(container.firstChild?.firstChild).toHaveClass('h-1.5')

    rerender(<ProgressBar progress={50} size="lg" />)
    expect(container.firstChild?.firstChild).toHaveClass('h-4')
  })

  describe('Stats and Completion', () => {
    it('shows mastery percentage when showStats is true', () => {
      render(<ProgressBar progress={75} showStats={true} />)
      expect(screen.getByText(/75% Mastery/i)).toBeInTheDocument()
    })

    it('hides stats when showStats is false', () => {
      render(<ProgressBar progress={75} showStats={false} />)
      expect(screen.queryByText(/Mastery/i)).not.toBeInTheDocument()
    })

    it('applies completed styles and shows "Perfect Score" when isCompleted is true', () => {
      const { container } = render(<ProgressBar progress={100} isCompleted={true} />)

      expect(screen.getByText(/Perfect Score/i)).toBeInTheDocument()

      const innerBar = container.querySelector('.bg-gradient-to-r')
      expect(innerBar).toHaveClass('from-yellow-400', 'to-orange-500')

      expect(screen.getByText(/Perfect Score/i).parentElement?.lastChild).toHaveClass(
        'animate-pulse',
      )
    })

    it('renders indigo colors when not completed', () => {
      const { container } = render(<ProgressBar progress={10} isCompleted={false} />)
      const innerBar = container.querySelector('.bg-indigo-600')
      expect(innerBar).toBeInTheDocument()
      expect(screen.queryByText(/Perfect Score/i)).not.toBeInTheDocument()
    })
  })
})
