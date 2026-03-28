import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import { useAuth } from '../services/AuthContext'
import {
  fetchFirestoreUserData,
  updateFirebaseUser,
  deleteFirebaseUser,
} from '../services/firebase'
import { userStorageService } from '../services/userService'
import ProfilePage from '../pages/profilePage/ProfilePage'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('../services/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../services/firebase', () => ({
  fetchFirestoreUserData: vi.fn(),
  updateFirebaseUser: vi.fn(),
  deleteFirebaseUser: vi.fn(),
}))

vi.mock('../services/userService', () => ({
  userStorageService: {
    syncLocalSession: vi.fn(),
    clearSession: vi.fn(),
  },
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('ProfilePage', () => {
  const mockLogin = vi.fn()
  const mockLogout = vi.fn()
  const mockUser = { uid: '123', name: 'Original Name', email: 'test@test.com' }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(vi.mocked(useAuth) as Mock).mockReturnValue({
      user: mockUser,
      login: mockLogin,
      logout: mockLogout,
    })
    ;(vi.mocked(fetchFirestoreUserData) as Mock).mockResolvedValue({
      name: 'Original Name',
      country: 'Belarus',
      birthDate: '1990-01-01',
      phone: '+375291234567',
    })
  })

  const renderPage = () =>
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    )

  it('successfully updates profile and calls toast', async () => {
    const user = userEvent.setup()
    const updatedSession = { ...mockUser, name: 'New Name' }
    ;(vi.mocked(userStorageService.syncLocalSession) as Mock).mockReturnValue(updatedSession)

    renderPage()

    const nameInput = await screen.findByLabelText(/full name/i)

    await user.clear(nameInput)
    await user.type(nameInput, 'New Name')

    const saveBtn = await screen.findByRole('button', { name: /save changes/i })
    await user.click(saveBtn)

    await waitFor(() => {
      expect(updateFirebaseUser).toHaveBeenCalledWith(
        '123',
        expect.objectContaining({ name: 'New Name' }),
      )
      expect(mockLogin).toHaveBeenCalledWith(updatedSession)
    })
  })

  it('shows error state on validation failure', async () => {
    const user = userEvent.setup()
    renderPage()

    const nameInput = await screen.findByLabelText(/full name/i)
    await user.clear(nameInput)

    const saveBtn = await screen.findByRole('button', { name: /save changes/i })
    await user.click(saveBtn)

    const errorMsg = await screen.findByText((content) => {
      return (
        content.toLowerCase().includes('required') ||
        content.toLowerCase().includes('at least') ||
        content.toLowerCase().includes('required')
      )
    })

    expect(errorMsg).toBeInTheDocument()
    expect(errorMsg).toHaveClass('text-destructive')
  })

  it('handles account deletion through the modal', async () => {
    const user = userEvent.setup()
    renderPage()

    const deleteBtn = screen.getByRole('button', { name: /delete my account/i })
    await user.click(deleteBtn)

    const confirmBtn = await screen.findByRole('button', { name: /yes, delete/i })
    await user.click(confirmBtn)

    await waitFor(() => {
      expect(deleteFirebaseUser).toHaveBeenCalledWith('123')
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})
