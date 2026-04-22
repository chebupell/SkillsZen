import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { useAuth } from '../services/AuthContext'
import { getCourseSubPage } from '../services/firebase'
import type { CourseSubPageProps } from '../types/exerciseTypes'
import CoursePage from '../pages/exercises/coursePage/coursePage'

vi.mock('../services/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../services/firebase', () => ({
  getCourseSubPage: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: vi.fn(),
  }
})

describe('CoursePage', () => {
  const mockedUseAuth = useAuth as Mock
  const mockedGetSubPage = getCourseSubPage as Mock
  const mockedUseLocation = useLocation as Mock

  const mockData: CourseSubPageProps = {
    topicImg: 'typescript',
    topicTitle: 'TypeScript Masterclass',
    statusText: '50% Complete',
    exercisesProgress: '50',
    exercises: [],
    courseId: '',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockedUseAuth.mockReturnValue({ user: { uid: 'user-123' } })
    mockedUseLocation.mockReturnValue({ pathname: '/ts' })
  })

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <CoursePage courseId="ts" backgroundImage="bg.jpg" />
      </MemoryRouter>,
    )

  it('shows PageLoader while fetching data', () => {
    mockedGetSubPage.mockReturnValue(new Promise(() => {})) // Never resolves
    renderComponent()
    expect(screen.getByTestId('page-loader')).toBeInTheDocument()
  })

  it('renders CourseSubPage content after successful fetch', async () => {
    mockedGetSubPage.mockResolvedValue(mockData)
    renderComponent()

    await waitFor(() => {
      expect(screen.queryByTestId('page-loader')).not.toBeInTheDocument()
    })

    expect(screen.getByText('TypeScript Masterclass')).toBeInTheDocument()
    expect(screen.getByText(/50\s+completed blocks/i)).toBeInTheDocument()
  })

  it('does not render "TS Cards" button on other paths', async () => {
    mockedUseLocation.mockReturnValue({ pathname: '/js' })
    mockedGetSubPage.mockResolvedValue(mockData)

    render(
      <MemoryRouter>
        <CoursePage courseId="js" backgroundImage="bg.jpg" />
      </MemoryRouter>,
    )

    await waitFor(() => expect(screen.queryByTestId('page-loader')).not.toBeInTheDocument())
    expect(screen.queryByRole('button', { name: /ts cards/i })).not.toBeInTheDocument()
  })

  it('shows error message if data fetch fails', async () => {
    mockedGetSubPage.mockResolvedValue(null)
    renderComponent()

    const errorMsg = await screen.findByText(/course data not found/i)
    expect(errorMsg).toBeInTheDocument()
    expect(errorMsg).toHaveClass('text-red-500')
  })
})
