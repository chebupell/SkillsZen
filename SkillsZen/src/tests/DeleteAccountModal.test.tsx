import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteAccountModal } from '../components/shared/Profile/DeleteAccountModal'

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Эмуляция PointerEvents (без этого AlertDialog может не реагировать на клики в JSDOM)
if (!window.PointerEvent) {
  window.PointerEvent = class PointerEvent extends MouseEvent {} as typeof PointerEvent
}

describe('DeleteAccountModal', () => {

  type ConfirmFn = (password: string) => Promise<void>

  const mockOnConfirm = vi.fn<ConfirmFn>()

  beforeEach(() => {
    vi.clearAllMocks()
    mockOnConfirm.mockImplementation(async () => {
      return Promise.resolve()
    })
  })

  it('opens dialog, requires password and calls onConfirm', async () => {
    const user = userEvent.setup()
    

    render(<DeleteAccountModal onConfirm={mockOnConfirm} isDeleting={false} />)

    const triggerBtn = screen.getByRole('button', { name: /delete profile/i })
    await user.click(triggerBtn)


    const passwordInput = await screen.findByPlaceholderText('••••••••')
    const confirmBtn = screen.getByRole('button', { name: /confirm deletion/i })


    expect(confirmBtn).toBeDisabled()

  
    await user.type(passwordInput, 'mypassword123')
    expect(confirmBtn).toBeEnabled()

  
    await user.click(confirmBtn)

    expect(mockOnConfirm).toHaveBeenCalledWith('mypassword123')
    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
  })


  it('shows loading spinner and disables buttons when isDeleting is true', async () => {
    const user = userEvent.setup()
    render(<DeleteAccountModal onConfirm={mockOnConfirm} isDeleting={true} />)

    await user.click(screen.getByRole('button', { name: /delete profile/i }))

    const actionBtn = screen.getByRole('button', { name: '' }) 
    const cancelBtn = screen.getByRole('button', { name: /cancel/i })

    expect(actionBtn).toBeDisabled()
    expect(cancelBtn).toBeDisabled()
    
    const loader = actionBtn.querySelector('.animate-spin')
    expect(loader).toBeInTheDocument()
  })

  it('resets password state when cancel is clicked', async () => {
    const user = userEvent.setup()
    render(<DeleteAccountModal onConfirm={mockOnConfirm} isDeleting={false} />)

    await user.click(screen.getByRole('button', { name: /delete profile/i }))
    const passwordInput = await screen.findByPlaceholderText('••••••••')
    await user.type(passwordInput, 'temporary-text')

    const cancelBtn = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelBtn)

    await waitFor(() => {
      expect(screen.queryByText(/confirm identity/i)).not.toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /delete profile/i }))
    const inputAfterReopen = await screen.findByPlaceholderText('••••••••')
    expect(inputAfterReopen).toHaveValue('')
  })
})

