import { render, screen } from '@testing-library/react'
import { expect, it, describe, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'

import { CourseSubPage } from '../pages/exercises/courseSubPage/courseSubPage'
import { useAuth } from '../services/AuthContext'
import type { CourseSubPageProps } from '../types/exerciseTypes'
import type { AuthContextType } from '../services/AuthContext'

vi.mock('../services/AuthContext', () => ({
  useAuth: vi.fn(),
}))

describe('ExerciseSubPage', () => {
  const mockedUseAuth = vi.mocked(useAuth)

  const mockProps: CourseSubPageProps = {
    courseId: 'ts_course',
    topicImg: '/test-img.png',
    topicTitle: 'Test Topic Title',
    statusText: 'test 5 questions',
    exercisesProgress: '1/5 completed',
    exercises: [{ id: '1', title: 'exercise 1', status: 'completed', totalQuestions: 6 }],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockedUseAuth.mockReturnValue({
      user: { uid: 'test-user', name: 'John Doe' },
      isLoading: false,
      isAuthenticated: true,
    } as AuthContextType)
  })


  const renderWithRouter = (props: CourseSubPageProps) => {
    return render(
      <BrowserRouter>
        <CourseSubPage {...props} />
      </BrowserRouter>,
    )
  }

  it('should render topic title correctly', () => {
    renderWithRouter(mockProps)
    expect(screen.getByText('Test Topic Title')).toBeInTheDocument()
  })

  it('should render progress correctly', () => {
    renderWithRouter(mockProps)
    expect(screen.getByText(/1\/5 completed/i)).toBeInTheDocument()
  })

  it('should render status tags correctly', () => {
    const statusProps: CourseSubPageProps = {
      ...mockProps,
      exercises: [
        { id: '1', title: 'Exercise 1', status: 'completed', totalQuestions: 6 },
        { id: '2', title: 'Exercise 2', status: 'try_again', totalQuestions: 5 },
        { id: '3', title: 'Exercise 3', status: 'in_progress', totalQuestions: 4 },
        { id: '4', title: 'Exercise 4', status: 'not_started', totalQuestions: 4 },
      ],
    }

    renderWithRouter(statusProps)
    expect(screen.getAllByText(/Completed/i).length).toBeGreaterThan(0)

    expect(screen.getByText(/Try Again/i)).toBeInTheDocument()
    expect(screen.getByText(/In Progress/i)).toBeInTheDocument()
    expect(screen.getByText(/Not Started/i)).toBeInTheDocument()
  })
})
