import SuccessTag from './successTag'
import { render, screen } from '@testing-library/react'

describe('SuccessTag', () => {
  it('should contain "Completed"', () => {
    render(<SuccessTag />)
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })
})
