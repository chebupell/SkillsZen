import { render, screen } from '@testing-library/react'
import InProgressTag from '../pages/exercises/tags/inProgressTag'

describe('InProgressTag', () => {
  it('should contain Title "In Progress"', () => {
    render(<InProgressTag />)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })
})
