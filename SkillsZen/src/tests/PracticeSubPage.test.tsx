import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { practiceService } from '../services/practiceService'
import type { Task, PracticePageProps } from '../types/practiceTypes'
import PracticeSubPage from '../pages/exercises/practice/practiceSubPage'

vi.mock('../services/practiceService', () => ({
  practiceService: {
    updateProgress: vi.fn(),
  },
}))


vi.mock('../components/shared/backButton', () => ({ BackButton: () => <button>Back</button> }))
vi.mock('../components/shared/ProgressBar', () => ({
  ProgressBar: () => <div data-testid="progress-bar" />,
}))


vi.mock('../components/shared/seeResultsButton', () => ({
  default: ({ disabled }: { disabled: boolean }) => (
    <button disabled={disabled}>See Results</button>
  ),
}))

vi.mock('../components/shared/nextQuestionButton', () => ({
  default: ({ disabled, onClick }: { disabled: boolean; onClick: () => void }) => (
    <button disabled={disabled} onClick={onClick}>
      Continue
    </button>
  ),
}))

describe('PracticeSubPage', () => {
  const mockOnNext = vi.fn()

  const mockTask: Task = {
    id: 'q-101',
    text: 'What is the result of 2 + 2?',
    question_type: 'multiple_choice',
    answers: [
      { id: 'a1', text: '3' },
      { id: 'a2', text: '4' },
    ],
    correct_answer: '4',
    explanation: 'Basic addition.',
  }

  const defaultProps: PracticePageProps = {
    userId: 'user-777',
    block_id: 'js-1',
    block_name: 'JS Basics',
    course_name: 'Javascript',
    status: 'in_progress',
    current_question: 0,
    total_questions: 10,
    correct_count: 5,
    question: mockTask,
    onNext: mockOnNext,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(practiceService.updateProgress).mockResolvedValue(undefined)
  })

  const renderWithRouter = (props: PracticePageProps) =>
    render(
      <MemoryRouter>
        <PracticeSubPage {...props} />
      </MemoryRouter>,
    )

  it('renders correctly with Task data', () => {
    renderWithRouter(defaultProps)

    expect(screen.getByText(/Question 1 \/ 10/i)).toBeInTheDocument()
    expect(screen.getByText(mockTask.text)).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('handles correct answer selection and calls practiceService', async () => {
    renderWithRouter(defaultProps)

    fireEvent.click(screen.getByText('4'))

    await waitFor(() => {
      expect(screen.getByText(/Correct!/i)).toBeInTheDocument()
      expect(screen.getByText(mockTask.explanation)).toBeInTheDocument()
    })

    expect(vi.mocked(practiceService.updateProgress)).toHaveBeenCalledWith(
      defaultProps.userId,
      defaultProps.block_id,
      expect.objectContaining({
        correct_count: 6,
        current_question: 1,
        status: 'in_progress',
      }),
    )
  })

  it('switches to See Results on the final question', async () => {
    const lastQuestionProps: PracticePageProps = {
      ...defaultProps,
      current_question: 9,
    }

    renderWithRouter(lastQuestionProps)

    fireEvent.click(screen.getByText('4'))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /see results/i })).toBeInTheDocument()
    })
  })

  it('handles loading state during progress update', async () => {
    vi.mocked(practiceService.updateProgress).mockReturnValue(new Promise(() => {}))

    renderWithRouter(defaultProps)
    fireEvent.click(screen.getByText('4'))

    fireEvent.click(screen.getByText('3'))

    expect(screen.queryByText(/Incorrect/i)).not.toBeInTheDocument()
  })
})
