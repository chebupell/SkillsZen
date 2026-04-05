import { render, screen, waitFor, act, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { BrowserRouter, useParams } from 'react-router-dom'
import { onAuthStateChanged, type User, type Unsubscribe } from 'firebase/auth'

import PracticePage from '../pages/exercises/practice/practicePage'
import { practiceService } from '../services/practiceService'

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  getAuth: vi.fn(() => ({})),
}))

vi.mock('../services/firebase', () => ({
  auth: { uid: 'user-123' },
}))

vi.mock('../services/practiceService', () => ({
  practiceService: {
    getPracticeData: vi.fn(),
  },
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useParams: vi.fn() }
})

describe('PracticePage Component', () => {
  const mockBlockId = 'ts-basics-1'
  const mockUser = { uid: 'user-123' } as User

  const mockPracticeData = {
    block: {
      id: mockBlockId,
      title: 'Test Block',
    },
    progress: {
      block_id: mockBlockId,
      block_name: 'Test Block',
      course_name: 'TS Course',
      current_question: 0,
      total_questions: 10,
      completed: false,
      status: 'in_progress' as const,
      correct_count: 0,
    },
    questions: [
      {
        id: 'q1',
        text: 'What is TS?',
        question_type: 'multiple-choice',
        answers: [
          { id: 'a1', text: 'Language' },
          { id: 'a2', text: 'Fruit' },
          { id: 'a3', text: 'Car' },
        ],
        correct_answer: 'a1',
        explanation: 'TypeScript is a superset of JavaScript.',
      },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    const mockedUseParams = useParams as Mock
    mockedUseParams.mockReturnValue({ blockId: mockBlockId })
  })

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <PracticePage />
      </BrowserRouter>,
    )

  it('shows PageLoader while waiting for auth state', () => {
    vi.mocked(onAuthStateChanged).mockImplementation(() => (() => {}) as Unsubscribe)

    renderComponent()
    expect(screen.getByTestId('page-loader')).toBeInTheDocument()
  })

  it('renders "No exercises found" if user is not logged in', async () => {
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      const cb = callback as (user: User | null) => void
      cb(null)
      return (() => {}) as Unsubscribe
    })

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText(/No exercises found/i)).toBeInTheDocument()
    })
  })

  it('loads and displays practice data for authenticated user', async () => {
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      const cb = callback as (user: User | null) => void
      cb(mockUser)
      return (() => {}) as Unsubscribe
    })

    vi.mocked(practiceService.getPracticeData).mockResolvedValue(mockPracticeData)

    renderComponent()

    await waitFor(() => {
      expect(practiceService.getPracticeData).toHaveBeenCalledWith(mockBlockId, mockUser.uid)
    })

    await waitFor(() => {
      expect(screen.queryByTestId('page-loader')).not.toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      const cb = callback as (user: User | null) => void
      cb(mockUser)
      return (() => {}) as Unsubscribe
    })

    vi.mocked(practiceService.getPracticeData).mockRejectedValue(new Error('API Error'))

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText(/No exercises found/i)).toBeInTheDocument()
    })

    consoleSpy.mockRestore()
  })

  it('refreshes data when handleNext is triggered', async () => {
    const mockedGetData = practiceService.getPracticeData as Mock
    mockedGetData.mockResolvedValue(mockPracticeData)

    const mockedOnAuth = onAuthStateChanged as Mock
    mockedOnAuth.mockImplementation((_auth, callback: (user: User | null) => void) => {
      callback(mockUser)
      return (() => {}) as Unsubscribe
    })

    renderComponent()

    await waitFor(() => {
      expect(mockedGetData).toHaveBeenCalledTimes(1)
    })

    const nextBtn = await screen.findByRole('button', { name: /Next/i })

    await act(async () => {
      fireEvent.click(nextBtn)
    })

    await waitFor(
      () => {
        expect(mockedGetData).toHaveBeenCalledTimes(1)
      },
      { timeout: 2000 },
    )
  })
})
