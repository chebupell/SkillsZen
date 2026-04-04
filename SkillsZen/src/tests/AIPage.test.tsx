import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { toast } from 'sonner'

import { useAuth, type AuthContextType } from '../services/AuthContext'
import { getGroqChatCompletion } from '../services/groq'
import type { ChatMessage } from '../types/chatTypes'
import type { UserSession } from '../types/UserTypes'
import AIChat from '../pages/AIPage/AIPage'

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock('../services/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../services/groq', () => ({
  getGroqChatCompletion: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('AIChat Page', () => {
  const mockedUseAuth = vi.mocked(useAuth)
  const mockedGroq = vi.mocked(getGroqChatCompletion)

  const mockUser: UserSession = {
    uid: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    accessToken: 'token',
    lastLogin: 'now',
    photo: 'https://photo.com',
    chatHistory: [],
  }

  const mockUpdateChat = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
    window.HTMLElement.prototype.scrollIntoView = vi.fn()

   mockedUseAuth.mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateChat: mockUpdateChat.mockResolvedValue(undefined),
      updateTaskStatus: vi.fn().mockResolvedValue(undefined),
      setDraftLocal: vi.fn(),
      saveDraftToCloud: vi.fn().mockResolvedValue(undefined),
      resetDraft: vi.fn().mockResolvedValue(undefined),
    } as AuthContextType) 
  })

  const renderChat = () =>
    render(
      <MemoryRouter>
        <AIChat />
      </MemoryRouter>,
    )

  it('sends message and handles AI response stream', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

    const aiText = 'Hello! I am your assistant.'
    
    mockedGroq.mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return { 
        choices: [{ message: { content: aiText, role: 'assistant' } }] 
      } as Awaited<ReturnType<typeof getGroqChatCompletion>>
    })

    renderChat()

    const input = await screen.findByPlaceholderText(/type a message/i)
    await user.type(input, 'Hi')
    await user.keyboard('{Enter}')

    expect(await screen.findByText(/Thinking\.\.\./i)).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(5000)
      await vi.runAllTimersAsync() 
    })

    await waitFor(() => {
      expect(screen.getByText(aiText)).toBeInTheDocument()
      expect(mockUpdateChat).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ role: 'assistant', content: aiText })
        ])
      )
    })

    vi.useRealTimers()
  })

    it('clears chat history through confirmation modal', async () => {
    const user = userEvent.setup()
    const history: ChatMessage[] = [{ role: 'user', content: 'Old message' }]

    mockedUseAuth.mockReturnValue({
        user: { ...mockUser, chatHistory: history },
        isLoading: false,
        updateChat: mockUpdateChat.mockResolvedValue(undefined),
    } as unknown as AuthContextType)

    renderChat()

    const openModalBtn = await screen.findByLabelText(/clear history/i)
    await user.click(openModalBtn)

    const confirmBtn = await screen.findByRole('button', { name: /^clear all$/i }) 
    await user.click(confirmBtn)

    await waitFor(() => {
      expect(mockUpdateChat).toHaveBeenCalledWith([])
      expect(toast.success).toHaveBeenCalledWith('Chat history cleared')
    })
  })


  it('handles API failure and restores input text', async () => {
    const user = userEvent.setup()
    mockedGroq.mockRejectedValue(new Error('Network Error'))

    renderChat()
    const input = await screen.findByPlaceholderText(/type a message/i)

    await user.type(input, 'Retry this')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Network Error')
      expect(input).toHaveValue('Retry this')
    })
  })
})

