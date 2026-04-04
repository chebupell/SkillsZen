import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { BrowserRouter } from 'react-router-dom'

import { getAllCoursesWithProgress } from '../services/firebase'
import { useAuth, type AuthContextType } from '../services/AuthContext'
import type { ExerciseCardProps } from '../types/menuTypes'
import Menu from '../pages/menuPage/menuPage'
import type { UserSession } from '../types/UserTypes'

vi.mock('../services/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../services/firebase', () => ({
  getAllCoursesWithProgress: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('Menu Component', () => {
  const mockedUseAuth = useAuth as Mock
  const mockedGetCourses = getAllCoursesWithProgress as Mock

  const mockUser: UserSession = {
    uid: 'user-123',
    name: 'John Doe',
    email: 'john@example.com', 
    accessToken: 'mock-token', 
    lastLogin: '2026-04-05',
    photo: 'https://example.com',
    chatHistory: [], 
  }

  const mockCourses: ExerciseCardProps[] = [
    {
      id: '1',
      name: 'TypeScript Basics',
      icon: 'TS',
      description: 'Learn TS',
      completed_blocks: 2,
      total_blocks: 5,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    mockedUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      updateTaskStatus: vi.fn().mockResolvedValue(undefined),
      updateChat: vi.fn().mockResolvedValue(undefined),
      setDraftLocal: vi.fn(),
      saveDraftToCloud: vi.fn().mockResolvedValue(undefined),
      resetDraft: vi.fn().mockResolvedValue(undefined),
    } satisfies AuthContextType)

    mockedGetCourses.mockResolvedValue(mockCourses)
  })

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <Menu backgroundImage="test-bg.jpg" />
      </BrowserRouter>,
    )

  it('shows PageLoader while fetching data', () => {
    mockedGetCourses.mockReturnValue(new Promise(() => {}))
    renderComponent()
    expect(screen.getByTestId('page-loader')).toBeInTheDocument()
  })

  it('renders welcome message with only first name', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.queryByTestId('page-loader')).not.toBeInTheDocument()
    })

    expect(screen.getByText(/Welcome, John!/i)).toBeInTheDocument()
  })

  it('renders exercise cards correctly after loading', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('TypeScript Basics')).toBeInTheDocument()
    })

    expect(screen.getByText(/2\/5 blocks completed/i)).toBeInTheDocument()
    expect(mockedGetCourses).toHaveBeenCalledWith(mockUser.uid)
  })

  it('navigates to AI Chat when AI Chat button is clicked', async () => {
    renderComponent()
    const aiChatBtn = await screen.findByText(/AI Chat/i)
    fireEvent.click(aiChatBtn)

    expect(mockNavigate).toHaveBeenCalledWith('/ai-chat')
  })

  it('does not render ActionButtons if user is not authenticated', async () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    } as unknown as AuthContextType)

    renderComponent()

    await waitFor(() => {
      expect(screen.queryByText(/AI Chat/i)).not.toBeInTheDocument()
    })
  })
})
