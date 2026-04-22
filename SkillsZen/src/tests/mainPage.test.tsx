import { render, screen } from '@testing-library/react'
import {
  MemoryRouter,
  useNavigation,
  useLocation,
  type Navigation,
  type Location,
} from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'

import { useAuth } from '../services/AuthContext'
import MainPage from '../pages/mainPage/mainPage'

vi.mock('../services/AuthContext', () => ({
  useAuth: vi.fn(),
}))

// 2. Mock Router hooks
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigation: vi.fn(),
    useLocation: vi.fn(),
    Outlet: () => <div data-testid="outlet" />,
  }
})

vi.mock('../components/shared/header', () => ({ Header: () => <header>Header</header> }))
vi.mock('../components/shared/footer', () => ({
  Footer: () => <footer role="contentinfo">Footer</footer>,
}))
vi.mock('../components/shared/PageLoader', () => ({
  PageLoader: () => <div data-testid="page-loader" />,
}))

describe('MainPage Layout', () => {
  const mockedUseAuth = useAuth as Mock

  beforeEach(() => {
    vi.clearAllMocks()

    mockedUseAuth.mockReturnValue({
      user: { name: 'John Doe' },
      isAuthenticated: true,
      isLoading: false,
    })

    vi.mocked(useNavigation).mockReturnValue({ state: 'idle' } as Partial<Navigation> as Navigation)
    vi.mocked(useLocation).mockReturnValue({ pathname: '/' } as Partial<Location> as Location)
  })

  it('renders Header and Outlet by default', () => {
    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })

  it('shows PageLoader when navigation state is loading', () => {
    vi.mocked(useNavigation).mockReturnValue({
      state: 'loading',
    } as Partial<Navigation> as Navigation)

    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('page-loader')).toBeInTheDocument()
  })

  it('renders Footer only on Auth pages', () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/sign-in',
    } as Partial<Location> as Location)

    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('verifies AI Chat specific styles', () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/ai-chat',
    } as Partial<Location> as Location)

    const { container } = render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>,
    )

    const rootDiv = container.firstChild as HTMLElement
    expect(rootDiv).toHaveClass('h-screen', 'overflow-hidden')
  })
})
