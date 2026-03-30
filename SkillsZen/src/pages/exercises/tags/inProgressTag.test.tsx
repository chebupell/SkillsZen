import InProgressTag from './inProgressTag'
import { render, screen } from '@testing-library/react'

describe('InProgressTag', () => {
  it('should contain Title "In Progress"', () => {
    render(<InProgressTag />)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })
})
