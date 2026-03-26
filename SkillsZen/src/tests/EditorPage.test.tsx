import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { useAuth } from '../services/AuthContext'
import { getTaskData, runCodeInBrowser } from '../services/firebase'
import type { TaskData, UserSession } from '../types/types'
import EditorPage from '../pages/coding/EditorPage'

vi.mock('../services/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../services/firebase', () => ({
  getTaskData: vi.fn(),
  runCodeInBrowser: vi.fn(),
}))

vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ taskId: 'task-123' }),
  }
})

describe('EditorPage', () => {
  const mockTask: TaskData = {
    text: '# Task Title\nSolve this!',
    initial_code: 'function main() {}',
    tests: ['test content'],
    type: '',
  }

  const mockedUseAuth = vi.mocked(useAuth)
  const mockedGetTaskData = vi.mocked(getTaskData)
  const mockedRunCode = vi.mocked(runCodeInBrowser)
  const mockUpdateTaskStatus = vi.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    vi.clearAllMocks()

    mockedUseAuth.mockReturnValue({
      user: { completedTasks: {} } as UserSession,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateTaskStatus: mockUpdateTaskStatus,
    })

    mockedGetTaskData.mockResolvedValue(mockTask)
  })

  it('renders PageLoader and then displays documentation', async () => {
    render(
      <MemoryRouter>
        <EditorPage />
      </MemoryRouter>,
    )

    expect(screen.getByText(/Preparing/i)).toBeInTheDocument()
    expect(screen.getByText(/Skills/i)).toBeInTheDocument()

    await waitFor(
      () => {
        expect(screen.getByText(/Solve this!/i)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
    expect(screen.queryByText(/Preparing/i)).not.toBeInTheDocument()
  })

  it('updates editor code and persists to localStorage', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

    render(
      <MemoryRouter>
        <EditorPage />
      </MemoryRouter>,
    )

    const editor = await screen.findByTestId('monaco-editor')
    fireEvent.change(editor, { target: { value: 'const x = 10;' } })

    expect(setItemSpy).toHaveBeenCalledWith('draft_task-123', 'const x = 10;')
  })

  it('resets code to initial state via ResetConfirmModal', async () => {
    render(
      <MemoryRouter>
        <EditorPage />
      </MemoryRouter>,
    )

    const editor = await screen.findByTestId('monaco-editor')
    fireEvent.change(editor, { target: { value: 'wrong code' } })

    const resetBtn = screen.getByTitle(/Reset Code/i)
    fireEvent.click(resetBtn)

    const confirmBtn = screen.getByRole('button', { name: /Reset Code/i })
    fireEvent.click(confirmBtn)

    expect(editor).toHaveValue(mockTask.initial_code)
  })

  it('handles critical sandbox errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    mockedRunCode.mockRejectedValue(new Error('Sandbox Crash'))
    render(
      <MemoryRouter>
        <EditorPage />
      </MemoryRouter>,
    )

    const runBtn = await screen.findByRole('button', { name: /run tests/i })
    fireEvent.click(runBtn)

    await waitFor(() => {
      expect(screen.getByText(/🔥 Critical Sandbox Error/i)).toBeInTheDocument()
      expect(consoleSpy).toHaveBeenCalledWith('Test Execution Error:', expect.any(Error))
    })
    consoleSpy.mockRestore()
  })
})
