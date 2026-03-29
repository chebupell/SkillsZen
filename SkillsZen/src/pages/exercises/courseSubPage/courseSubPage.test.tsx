import { render, screen } from '@testing-library/react'
import { expect, it, describe } from 'vitest'
import { CourseSubPage } from './courseSubPage'
import type { CourseSubPageProps } from '../../../types/exerciseTypes'
import { BrowserRouter } from 'react-router-dom'

describe('ExerciseSubPage', () => {
  const mockProps: CourseSubPageProps = {
    courseId: 'ts_course',
    topicImg: '/test-img.png',
    topicTitle: 'Test Topic Title',
    statusText: 'test 5 questions',
    exercisesProgress: '1/5 completed',
    exercises: [{ id: '1', title: 'exercise 1', status: 'completed', totalQuestions: 6 }],
  }

  it('should render topic title correctly', () => {
    render(
      <BrowserRouter>
        <CourseSubPage {...mockProps} />
      </BrowserRouter>,
    )
    expect(screen.getByText('Test Topic Title')).toBeInTheDocument()
  })

  it('should render progress correctly', () => {
    render(
      <BrowserRouter>
        <CourseSubPage {...mockProps} />
      </BrowserRouter>,
    )

    expect(screen.getByText('1/5 completed')).toBeInTheDocument()
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

    render(
      <BrowserRouter>
        <CourseSubPage {...statusProps} />
      </BrowserRouter>,
    )

    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Not Started')).toBeInTheDocument()
  })
})
