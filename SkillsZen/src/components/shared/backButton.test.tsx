import { useNavigate } from 'react-router-dom'
import BackButton from './backButton'
import { fireEvent, render, screen } from '@testing-library/react'

describe('BackButton', () => {
  vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
  }))

  it('BackButton should contain title `Back`', () => {
    render(<BackButton />)
    expect(screen.getByText('Back')).toBeInTheDocument()
  })

  it('BackButton should bring the user to previous page', () => {
    const mockNavigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)

    render(<BackButton />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
})
