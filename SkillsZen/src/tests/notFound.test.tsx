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
    vi.clearAllMocks()
  })

  const renderComponent = () => render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  )

  it('renders 404 text and main heading', () => {
    renderComponent()
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByText(/Lost in Space\?/i)).toBeInTheDocument()
  })

  it('navigates to home ("/") when "Back to Home" is clicked', () => {
    renderComponent()
    const homeBtn = screen.getByRole('button', { name: /back to home/i })
    fireEvent.click(homeBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('navigates back (-1) when "Go Back" is clicked', () => {
    renderComponent()
    const backBtn = screen.getByRole('button', { name: /go back/i })
    fireEvent.click(backBtn)
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })

})
