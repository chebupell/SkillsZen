import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteAccountModal } from './DeleteAccountModal'

describe('DeleteAccountModal', () => {
  const mockOnConfirm = vi.fn()

  it('opens dialog and calls onConfirm when clicking delete button', async () => {
    const user = userEvent.setup()
    render(<DeleteAccountModal onConfirm={mockOnConfirm} isDeleting={false} />)
    const triggerBtn = screen.getByRole('button', { name: /delete my account/i })
    await user.click(triggerBtn)

    const title = await screen.findByText(/are you absolutely sure/i)
    expect(title).toBeInTheDocument()

    const confirmBtn = screen.getByRole('button', { name: /yes, delete account/i })
    await user.click(confirmBtn)

    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
  })

  it('disables buttons and shows loading state when isDeleting is true', async () => {
    const user = userEvent.setup()
    render(<DeleteAccountModal onConfirm={mockOnConfirm} isDeleting={true} />)

    await user.click(screen.getByRole('button', { name: /delete my account/i }))

    const confirmBtn = screen.getByRole('button', { name: /deleting\.\.\./i })
    const cancelBtn = screen.getByRole('button', { name: /cancel/i })

    expect(confirmBtn).toBeDisabled()
    expect(cancelBtn).toBeDisabled()
  })

  it('closes dialog when cancel is clicked', async () => {
    const user = userEvent.setup()
    render(<DeleteAccountModal onConfirm={mockOnConfirm} isDeleting={false} />)

    await user.click(screen.getByRole('button', { name: /delete my account/i }))
    
    const cancelBtn = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelBtn)

    await waitFor(() => {
      expect(screen.queryByText(/are you absolutely sure/i)).not.toBeInTheDocument()
    })
  })
})
