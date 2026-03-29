import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import { useAuth } from '../services/AuthContext'
import { getCodingTasksAndProgress, type CodingTask } from '../services/firebase'
import type { UserSession } from '../types/UserTypes'
import CodingTasks from '../pages/coding/CodingTasks'

vi.mock('../services/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../services/firebase', () => ({
  getCodingTasksAndProgress: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('CodingTasks Page', () => {
  const mockTasks: CodingTask[] = [
    { id: 'task-1', name: 'Variable Basics', order: 1 },
    { id: 'task-2', name: 'Loop Masters', order: 2 },
  ]

  const mockedUseAuth = vi.mocked(useAuth)
  const mockedGetTasks = vi.mocked(getCodingTasksAndProgress)

  beforeEach(() => {
    vi.clearAllMocks()
    mockedUseAuth.mockReturnValue({
      user: {
        uid: 'user-123',
        completedTasks: { 'task-1': 'passed' },
      } as unknown as UserSession,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateTaskStatus: vi.fn(),
    })
  })

  it('renders PageLoader initially and then displays tasks', async () => {
    mockedGetTasks.mockResolvedValue({ tasks: mockTasks, progress: {} })

    render(
      <MemoryRouter>
        <CodingTasks />
      </MemoryRouter>,
    )

    expect(screen.getByText(/Preparing/i)).toBeInTheDocument()
    expect(screen.getByText(/Skills/i)).toBeInTheDocument()

    await waitFor(
      () => {
        expect(screen.getByText('Variable Basics')).toBeInTheDocument()
        expect(screen.getByText('Loop Masters')).toBeInTheDocument()
      },
      { timeout: 2000 },
    )

    expect(screen.queryByText(/Preparing/i)).not.toBeInTheDocument()
  })

  it('calculates and displays the correct progress in the header', async () => {
    mockedGetTasks.mockResolvedValue({ tasks: mockTasks, progress: {} })

    render(
      <MemoryRouter>
        <CodingTasks />
      </MemoryRouter>,
    )

    await waitFor(() => {
      const progressElement = screen.getByText((_content, element) => {
        const text = element?.textContent || ''
        const hasProgress = text.includes('1') && text.includes('/') && text.includes('2')
        const childrenDontHaveText = Array.from(element?.children || []).every((child) => {
          const childText = child.textContent || ''
          return !(childText.includes('1') && childText.includes('/') && childText.includes('2'))
        })
        return Boolean(hasProgress && childrenDontHaveText)
      })

      expect(progressElement).toBeInTheDocument()
    })
  })

  it('navigates to home when clicking the Back button', async () => {
    const user = userEvent.setup()
    mockedGetTasks.mockResolvedValue({ tasks: mockTasks, progress: {} })

    render(
      <MemoryRouter>
        <CodingTasks />
      </MemoryRouter>,
    )

    const backBtn = await screen.findByRole('button', { name: /back to home/i })
    await user.click(backBtn)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('shows error toast if fetching fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockedGetTasks.mockRejectedValue(new Error('Firebase Failure'))

    render(
      <MemoryRouter>
        <CodingTasks />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText(/Failed to load tasks/i)).toBeInTheDocument()
    })

    consoleSpy.mockRestore()
  })

  it('shows empty state when task array is empty', async () => {
    mockedGetTasks.mockResolvedValue({ tasks: [], progress: {} })

    render(
      <MemoryRouter>
        <CodingTasks />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText(/Challenge Awaits/i)).toBeInTheDocument()
    })
  })
})
