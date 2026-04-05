import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import TsCards from '../pages/exercises/tsCardsPage/tsCardsPage'
import {
  getTsCardsProgress,
  resetTsCardsProgress,
  setTsCardCheckedState,
} from '../services/tsCardsProgressService'
import { useAuth, type AuthContextType } from '../services/AuthContext'

vi.mock('../services/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const mockedUseAuth = useAuth as Mock

vi.mock('../services/tsCardsProgressService', () => ({
  getTsCardsProgress: vi.fn(),
  setTsCardCheckedState: vi.fn(),
  resetTsCardsProgress: vi.fn(),
}))

vi.mock('../data/ts-cards.json', () => ({
  default: {
    cards: [
      {
        id: '1',
        front: 'Type Alias',
        icon: 'alias.png',
        back: { description: 'Desc 1', example: 'type T = string', tip: 'Tip 1' },
      },
      {
        id: '2',
        front: 'Interface',
        icon: 'interface.png',
        back: { description: 'Desc 2', example: 'interface I {}', tip: 'Tip 2' },
      },
    ],
    bgVariants: ['bg-red-50', 'bg-blue-50'],
  },
}))

describe('TsCards Component', () => {
  const mockUser = {
    uid: 'user-123',
    name: 'Tester',
    email: 'test@test.com',
    accessToken: 'token',
    lastLogin: 'now',
    photo: null,
    chatHistory: [],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    window.HTMLElement.prototype.scrollIntoView = vi.fn()
    window.HTMLElement.prototype.getBoundingClientRect = vi.fn(
      () =>
        ({
          width: 100,
          height: 100,
          top: 10,
          left: 10,
          bottom: 0,
          right: 0,
          x: 10,
          y: 10,
          toJSON: () => {},
        }) as DOMRect,
    )

    mockedUseAuth.mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateTaskStatus: vi.fn().mockResolvedValue(undefined),
      updateChat: vi.fn().mockResolvedValue(undefined),
      setDraftLocal: vi.fn(),
      saveDraftToCloud: vi.fn().mockResolvedValue(undefined),
      resetDraft: vi.fn().mockResolvedValue(undefined),
    } satisfies AuthContextType)

    vi.mocked(getTsCardsProgress).mockResolvedValue({ checkedCardIds: ['1'] })
  })

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <TsCards />
      </BrowserRouter>,
    )

  it('renders all cards and handles loading state', async () => {
    renderComponent()
    await waitFor(() => {
      expect(screen.queryByTestId('page-loader')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Type Alias')).toBeInTheDocument()
    expect(screen.getByText('Interface')).toBeInTheDocument()
  })

  it('flips the card and shows back content', async () => {
    renderComponent()
    const cardFront = await screen.findByText('Type Alias')

    const cardContainer = cardFront.closest('.cursor-pointer')
    if (!cardContainer) throw new Error('Card container not found')

    fireEvent.click(cardContainer)

    expect(screen.getByText('Desc 1')).toBeInTheDocument()
    expect(screen.getByText('type T = string')).toBeInTheDocument()
  })

  it('handles checkbox change and triggers fly animation', async () => {
    renderComponent()
    await screen.findByText('Type Alias')

    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[]
    const targetCheckbox = checkboxes[1]

    const appendSpy = vi.spyOn(document.body, 'appendChild')

    await act(async () => {
      fireEvent.click(targetCheckbox)
    })

    expect(setTsCardCheckedState).toHaveBeenCalledWith(mockUser.uid, '2', true)

    expect(appendSpy).toHaveBeenCalled()

    await waitFor(() => {
      expect(screen.getByText(/100\s*%/)).toBeInTheDocument()
    })

    appendSpy.mockRestore()
  })

  it('navigates to Zen Garden only when all cards are finished', async () => {
    vi.mocked(getTsCardsProgress).mockResolvedValue({ checkedCardIds: ['1', '2'] })

    renderComponent()

    const entranceImg = await screen.findByAltText('Zen Garden Entrance')
    expect(entranceImg).toHaveClass('cursor-pointer')

    await act(async () => {
      fireEvent.click(entranceImg)
    })

    const gardenImage = await screen.findByAltText(/^Garden$/i)
    expect(gardenImage).toBeInTheDocument()

    const backBtn = screen.getByRole('button', { name: /Back to Cards/i })
    expect(backBtn).toBeInTheDocument()
  })

  it('resets progress correctly', async () => {
    vi.mocked(getTsCardsProgress).mockResolvedValue({ checkedCardIds: ['1'] })
    renderComponent()

    const resetBtn = await screen.findByRole('button', { name: /reset all cards/i })

    expect(screen.getByText(/50\s*%/)).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(resetBtn)
    })

    expect(resetTsCardsProgress).toHaveBeenCalledWith(mockUser.uid)

    await waitFor(() => {
      expect(screen.getByText(/0\s*%/)).toBeInTheDocument()
    })
  })
})
