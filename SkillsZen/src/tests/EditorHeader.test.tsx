import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EditorHeader from '../components/shared/EditorHeader'

describe('EditorHeader', () => {
  const defaultProps = {
    taskId: 'challenge-01',
    onReset: vi.fn(),
    onViewModeToggle: vi.fn(),
    viewMode: 'split' as const,
    onRun: vi.fn(),
    isRunning: false,
    navigate: vi.fn(),
    status: null,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the correct task filename', () => {
    render(<EditorHeader {...defaultProps} />)
    expect(screen.getByText(/challenge-01.js/i)).toBeInTheDocument()
  })

  it('renders "task.js" if taskId is undefined', () => {
    render(<EditorHeader {...defaultProps} taskId={undefined} />)
    expect(screen.getByText(/task.js/i)).toBeInTheDocument()
  })

  it('calls navigate when the Back button is clicked', () => {
    render(<EditorHeader {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /tasks/i }))
    expect(defaultProps.navigate).toHaveBeenCalledWith('/coding-tasks')
  })

  it('triggers onRun when Run Tests is clicked', () => {
    render(<EditorHeader {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /run tests/i }))
    expect(defaultProps.onRun).toHaveBeenCalledTimes(1)
  })

  describe('Status Badge logic', () => {
    it('does not render status badge when status is null', () => {
      render(<EditorHeader {...defaultProps} status={null} />)
      expect(screen.queryByText(/solved/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/failed/i)).not.toBeInTheDocument()
    })

    it('renders "Solved" badge and changes button text when status is "passed"', () => {
      render(<EditorHeader {...defaultProps} status="passed" />)
      expect(screen.getByText(/solved/i)).toBeInTheDocument()
      expect(screen.getByText(/re-run tests/i)).toBeInTheDocument()

      const runBtn = screen.getByRole('button', { name: /re-run tests/i })
      expect(runBtn).toHaveClass('bg-green-600')
    })

    it('renders "Failed" badge when status is "failed"', () => {
      render(<EditorHeader {...defaultProps} status="failed" />)
      expect(screen.getByText(/failed/i)).toBeInTheDocument()
      expect(screen.getByText(/run tests/i)).toBeInTheDocument()

      const runBtn = screen.getByRole('button', { name: /run tests/i })
      expect(runBtn).toHaveClass('bg-indigo-600')
    })
  })

  it('calls onViewModeToggle when layout button is clicked', () => {
    render(<EditorHeader {...defaultProps} />)
    fireEvent.click(screen.getByTitle(/toggle layout/i))
    expect(defaultProps.onViewModeToggle).toHaveBeenCalledTimes(1)
  })

  it('calls onReset when reset button is clicked', () => {
    render(<EditorHeader {...defaultProps} />)
    fireEvent.click(screen.getByTitle(/reset code/i))
    expect(defaultProps.onReset).toHaveBeenCalledTimes(1)
  })

  it('shows tooltip text on reset button hover', () => {
    render(<EditorHeader {...defaultProps} />)
    expect(screen.getByText(/reset all/i)).toHaveClass('scale-0')
    expect(screen.getByText(/reset all/i)).toBeInTheDocument()
  })
})
