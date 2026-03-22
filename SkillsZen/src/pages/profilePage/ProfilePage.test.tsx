import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ProfilePage } from './ProfilePage'
import { useAuth } from '../../services/AuthContext'
import {
  fetchFirestoreUserData,
  updateFirebaseUser,
  deleteFirebaseUser,
} from '../../services/firebase'
import { userStorageService } from '../../services/userService'

vi.mock('../../services/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../services/login', () => ({
  fetchFirestoreUserData: vi.fn(),
  updateFirebaseUser: vi.fn(),
  deleteFirebaseUser: vi.fn(),
}))

vi.mock('../../services/userService', () => ({
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

type UseAuthReturn = ReturnType<typeof useAuth>

describe('ProfilePage', () => {
  const mockLogin = vi.fn()
  const mockLogout = vi.fn()
  const mockUser = { uid: '123', name: 'Original Name', email: 'test@test.com' }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(vi.mocked(useAuth) as Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: mockLogin,
      logout: mockLogout,
    } as unknown as UseAuthReturn)
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

  it('loads and displays user data from Firestore', async () => {
    renderPage()

    const nameInput = await screen.findByLabelText(/full name/i)
    const countryInput = await screen.findByLabelText(/country/i)

    expect(nameInput).toHaveValue('Original Name')
    expect(countryInput).toHaveValue('Belarus')
    expect(screen.getByText('test@test.com')).toBeInTheDocument()
  })

  it('successfully updates profile on form submit', async () => {
    const user = userEvent.setup()
    const updatedSession = { ...mockUser, name: 'New Name' }
    ;(vi.mocked(userStorageService.syncLocalSession) as Mock).mockReturnValue(updatedSession)

    renderPage()
    const nameInput = await screen.findByLabelText(/full name/i)

    await user.clear(nameInput)
    await user.type(nameInput, 'New Name')

    const saveBtn = screen.getByRole('button', { name: /save profile/i })
    await user.click(saveBtn)

    await waitFor(() => {
      expect(updateFirebaseUser).toHaveBeenCalledWith(
        '123',
        expect.objectContaining({ name: 'New Name' }),
      )
      expect(mockLogin).toHaveBeenCalledWith(updatedSession)
    })
  })

  it('performs account deletion flow', async () => {
    const user = userEvent.setup()
    ;(vi.mocked(deleteFirebaseUser) as Mock).mockResolvedValue(undefined)

    renderPage()

    const deleteTrigger = screen.getByRole('button', { name: /delete my account/i })
    await user.click(deleteTrigger)

    const confirmBtn = await screen.findByRole('button', { name: /yes, delete account/i })
    await user.click(confirmBtn)

    await waitFor(() => {
      expect(deleteFirebaseUser).toHaveBeenCalledWith('123')
      expect(userStorageService.clearSession).toHaveBeenCalled()
      expect(mockLogout).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    renderPage()

    const nameInput = await screen.findByLabelText(/full name/i)
    await user.clear(nameInput)

    const saveBtn = screen.getByRole('button', { name: /save profile/i })
    await user.click(saveBtn)

    const errorMsg = await screen.findByText(/name is required|must be at least/i)

    expect(errorMsg).toBeInTheDocument()
    expect(errorMsg).toHaveClass('text-destructive')
    expect(nameInput).toHaveClass('border-destructive')
  })
})
