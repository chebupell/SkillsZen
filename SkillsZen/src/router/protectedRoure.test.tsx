import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './protectedRoute';
import { useAuth } from '../services/AuthContext';

vi.mock('../services/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /signin when user is NOT authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false } as any);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<div>Private Content</div>} />
          </Route>
          <Route path="/signin" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText(/private content/i)).not.toBeInTheDocument();
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });
});
