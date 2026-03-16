import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { signupService } from '../../services/login';
import { userStorageService } from '../../services/userService';
import { AuthPage } from './auth';

vi.mock('../../services/login', () => ({
  signupService: vi.fn(),
}));

vi.mock('../../services/userService', () => ({
  userStorageService: {
    saveSession: vi.fn(),
    getSession: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockLogin = vi.fn();
vi.mock('../../services/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

describe('AuthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPage = () => render(
    <MemoryRouter>
      <AuthPage />
    </MemoryRouter>
  );

  it('executes full signup flow on success', async () => {
    const user = userEvent.setup();
    const mockCred = { user: { email: 'test@example.com' } };
    const mockSess = { id: 'session_123' };

    vi.mocked(signupService).mockResolvedValue(mockCred as any);
    vi.mocked(userStorageService.getSession).mockReturnValue(mockSess as any);

    renderPage();

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Valid123!');
    
    const submitBtn = screen.getByRole('button', { name: /create account/i });
    await waitFor(() => expect(submitBtn).toBeEnabled());
    await user.click(submitBtn);

    await waitFor(() => {
      expect(signupService).toHaveBeenCalledWith('test@example.com', 'Valid123!');
      expect(userStorageService.saveSession).toHaveBeenCalledWith(mockCred);
      expect(mockLogin).toHaveBeenCalledWith(mockSess);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
