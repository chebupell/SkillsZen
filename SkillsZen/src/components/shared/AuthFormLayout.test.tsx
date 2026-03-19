import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthFormLayout } from './AuthFormLayout'
import userEvent from '@testing-library/user-event'
import type { Resolver, FieldErrors } from 'react-hook-form'
import type { AuthValues } from '../../types/types'

const mockResolver: Resolver<AuthValues> = async (values) => {
  const errors: FieldErrors<AuthValues> = {}

  if (!values.login) {
    errors.login = { type: 'required', message: 'Required' }
  }
  if (!values.password) {
    errors.password = { type: 'required', message: 'Required' }
  }

  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  }
}

describe('AuthFormLayout', () => {
  const user = userEvent.setup()
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const defaultProps = {
    title: 'Sign In',
    onSubmit: mockOnSubmit,
    buttonText: 'Login',
    loginLabel: 'Username',
    linkText: 'Register here',
    linkHref: '/signup',
    linkDescription: 'New user?',
  }

  const renderComponent = (props = defaultProps) => {
    return render(
      <MemoryRouter>
        <AuthFormLayout {...props} resolver={mockResolver} />
      </MemoryRouter>,
    )
  }

  it('renders all form elements correctly', () => {
    renderComponent()

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument()
    expect(screen.getByLabelText(defaultProps.loginLabel)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument()
  })

  it('disables the submit button initially due to empty fields', async () => {
    renderComponent()
    const button = screen.getByRole('button', { name: /^login$/i })

    await waitFor(() => {
      expect(button).toBeDisabled()
    })
  })

  it('enables button and submits the form with valid user input', async () => {
    renderComponent()

    const loginInput = screen.getByLabelText(defaultProps.loginLabel)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitBtn = screen.getByRole('button', { name: /^login$/i })

    await user.type(loginInput, 'testuser')
    await user.type(passwordInput, 'password123')

    await waitFor(() => expect(submitBtn).toBeEnabled())

    await user.click(submitBtn)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ login: 'testuser', password: 'password123' }),
        expect.anything(),
      )
    })
  })

  it('shows "Processing..." state during submission', async () => {
    let resolveSubmit: () => void
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve
    })

    mockOnSubmit.mockReturnValue(submitPromise)

    renderComponent()

    await user.type(screen.getByLabelText(defaultProps.loginLabel), 'user')
    await user.type(screen.getByLabelText(/password/i), 'pass')

    const submitBtn = screen.getByRole('button', { name: /^login$/i })
    await waitFor(() => expect(submitBtn).toBeEnabled())

    await user.click(submitBtn)

    expect(screen.getByText(/processing/i)).toBeInTheDocument()
    expect(submitBtn).toBeDisabled()

    await act(async () => {
      resolveSubmit!()
      await submitPromise
    })

    await waitFor(() => {
      expect(screen.queryByText(/processing/i)).not.toBeInTheDocument()
    })
  })
})
