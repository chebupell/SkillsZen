import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import { useAuth, type AuthContextType } from '../services/AuthContext'
import { getTaskData, getCodingTasksAndProgress, runCodeInBrowser } from '../services/firebase'
import type { UserSession } from '../types/UserTypes'
import EditorPage from '../pages/coding/EditorPage'
import type { CodingTask, TaskData } from '../types/codingTasksTypes'

vi.mock('../services/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('../services/firebase', () => ({
  getTaskData: vi.fn(),
  getCodingTasksAndProgress: vi.fn(),
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
    useParams: () => ({ taskId: 'task-1' }),
  }
})

describe('EditorPage', () => {
  const mockTask: TaskData & { id: string } = {
    id: 'task-1',
    text: 'Solve this!',
    initial_code: 'function main() {}',
    tests: ['test content'],
    type: 'javascript',
  }

  const mockTasksList: CodingTask[] = [
    { id: 'task-1', name: 'Task 1', order: 1 },
    { id: 'task-2', name: 'Task 2', order: 2 },
  ]

  const mockedUseAuth = vi.mocked(useAuth)
  const mockedGetTaskData = vi.mocked(getTaskData)
  const mockedGetTasksList = vi.mocked(getCodingTasksAndProgress)
  const mockedRunCode = vi.mocked(runCodeInBrowser)

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()

    mockedUseAuth.mockReturnValue({
      user: {
        uid: 'u1',
        drafts: {},
        completedTasks: {},
      } as unknown as UserSession,
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      setDraftLocal: vi.fn(),
      saveDraftToCloud: vi.fn().mockResolvedValue(undefined),
      resetDraft: vi.fn().mockResolvedValue(undefined),
      updateTaskStatus: vi.fn().mockResolvedValue(undefined),
      updateChat: () => Promise.resolve(),
    } satisfies AuthContextType)

    mockedGetTaskData.mockResolvedValue(mockTask)
    mockedGetTasksList.mockResolvedValue({ tasks: mockTasksList, progress: {} })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const renderEditor = () =>
    render(
      <MemoryRouter>
        <EditorPage />
      </MemoryRouter>,
    )

  it('loads and displays task content', async () => {
    renderEditor()
    expect(await screen.findByText(/Solve this!/i)).toBeInTheDocument()
    const editor = screen.getByTestId('monaco-editor')
    expect(editor).toHaveValue(mockTask.initial_code)
  })

  it('synchronizes code with cloud after debounce', async () => {
    vi.useRealTimers()
    const { saveDraftToCloud } = mockedUseAuth()

    renderEditor()

    const editor = await screen.findByTestId('monaco-editor')

    await waitFor(() => {
      expect(editor).toHaveValue(mockTask.initial_code)
    })

    vi.mocked(saveDraftToCloud).mockClear()

    vi.useFakeTimers()

    await act(async () => {
      fireEvent.change(editor, { target: { value: 'new code' } })
    })

    expect(saveDraftToCloud).toHaveBeenCalledWith('task-1', mockTask.initial_code)

    vi.mocked(saveDraftToCloud).mockClear()

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(saveDraftToCloud).toHaveBeenCalledWith('task-1', 'new code')

    vi.useRealTimers()
  })

  it('handles reset by reverting to task initial code', async () => {
    const user = userEvent.setup()
    renderEditor()

    const editor = await screen.findByTestId('monaco-editor')
    fireEvent.change(editor, { target: { value: 'dirty code' } })
    expect(editor).toHaveValue('dirty code')

    const resetTrigger = await screen.findByTitle(/Reset/i)
    await user.click(resetTrigger)

    const confirmBtn = await screen.findByRole('button', { name: /reset code/i })
    await user.click(confirmBtn)

    await waitFor(() => {
      expect(editor).toHaveValue(mockTask.initial_code)
    })
  })

  it('navigates to next task when tests pass', async () => {
    mockedRunCode.mockResolvedValue({
      output: '✅ PASSED',
      success: true,
    })

    renderEditor()

    const runBtn = await screen.findByRole('button', { name: /run/i })
    fireEvent.click(runBtn)

    const nextBtn = await screen.findByRole('button', { name: /Next Task/i })
    expect(nextBtn).toBeEnabled()
    fireEvent.click(nextBtn)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/coding-tasks/editor/task-2')
    })
  })
})
