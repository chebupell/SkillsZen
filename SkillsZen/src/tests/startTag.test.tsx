
import { render, screen } from '@testing-library/react'
import StartTag from '../pages/exercises/tags/startTag'

describe('StartTag', () => {
  it('should contain "Not Started"', () => {
    render(<StartTag />)
    expect(screen.getByText('Not Started')).toBeInTheDocument()
  })
})
