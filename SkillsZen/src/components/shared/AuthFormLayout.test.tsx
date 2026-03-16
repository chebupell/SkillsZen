import '@testing-library/jest-dom/vitest'; 
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthFormLayout } from './AuthFormLayout';
import userEvent from '@testing-library/user-event';
import type { Resolver } from 'react-hook-form';
import type { AuthValues } from '../../types/types';

const mockResolver: Resolver<AuthValues> = async (values) => ({
  values,
  errors: {},
});

describe('AuthFormLayout', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  const defaultProps = {
    title: 'Sign In',
    onSubmit: mockOnSubmit,
    buttonText: 'Login',
    loginLabel: 'Username',
    linkText: 'Register here',
    linkHref: '/signup',
    linkDescription: 'New user?',
  };

  const renderComponent = (props = defaultProps) => {
    return render(
      <MemoryRouter>
        <AuthFormLayout {...props} resolver={mockResolver} />
      </MemoryRouter>
    );
  };

  it('renders all form elements correctly', () => {
    renderComponent();
    
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByLabelText(defaultProps.loginLabel)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Login$/i })).toBeInTheDocument();
  });

  it('disables the submit button initially due to empty fields', () => {
    renderComponent();
    const button = screen.getByRole('button', { name: /^Login$/i });
    expect(button).toBeDisabled();
  });

  it('enables button and submits the form with valid user input', async () => {
    const user = userEvent.setup();
    renderComponent();

    const loginInput = screen.getByLabelText(defaultProps.loginLabel);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /^Login$/i });

    await user.type(loginInput, 'testuser');
    await user.type(passwordInput, 'password123');

    await waitFor(() => expect(submitBtn).toBeEnabled());

    await user.click(submitBtn);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      { login: 'testuser', password: 'password123' },
      expect.anything()
    );
  });

  it('shows "Processing..." state and disables button during submission', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    renderComponent();

    await user.type(screen.getByLabelText(defaultProps.loginLabel), 'user');
    await user.type(screen.getByLabelText(/password/i), 'pass');

    const submitBtn = screen.getByRole('button', { name: /^Login$/i });
    await waitFor(() => expect(submitBtn).toBeEnabled());

    await user.click(submitBtn);

    expect(screen.getByText(/processing/i)).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });
});

