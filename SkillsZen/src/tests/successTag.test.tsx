
import { render, screen } from '@testing-library/react'
import SuccessTag from '../pages/exercises/tags/successTag'

describe('SuccessTag', () => {
  it('should contain "Completed"', () => {
    render(<SuccessTag />)
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })
})
