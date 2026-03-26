import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { NotFound } from '../pages/404Page/notFound'


const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('NotFound Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders 404 text and main heading', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    )

    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByText(/Lost in Space\?/i)).toBeInTheDocument()
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument()
  })

  it('navigates to home ("/") when "Back to Home" is clicked', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    )

    const homeBtn = screen.getByRole('button', { name: /back to home/i })
    fireEvent.click(homeBtn)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('navigates back (-1) when "Go Back" is clicked', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    )

    const backBtn = screen.getByRole('button', { name: /go back/i })
    fireEvent.click(backBtn)

    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })

  it('contains the correct background image class', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    )

    const container = screen.getByText('404').closest('div')?.parentElement?.parentElement
    expect(container).toHaveClass("bg-[url('/background-images/main-page-background.png')]")
  })
})
