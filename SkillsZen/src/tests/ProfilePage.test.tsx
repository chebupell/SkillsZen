import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { toast } from 'sonner'
import type { UserCredential } from 'firebase/auth'

import { useAuth, type AuthContextType } from '../services/AuthContext'
import {
  fetchFirestoreUserData,
  updateFirebaseUser,
  deleteFirebaseUser,
  reauthenticateUser,
} from '../services/firebase'
import { userStorageService } from '../services/userService'
import type { ProfileValues, UserSession } from '../types/UserTypes'
import ProfilePage from '../pages/profilePage/ProfilePage'
import { compressImage } from '../services/imageHelper'

vi.mock('../services/imageHelper', () => ({
  compressImage: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn().mockReturnValue('toast-id'),
  },
}))

vi.mock('../services/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../services/firebase', () => ({
  fetchFirestoreUserData: vi.fn(),
  updateFirebaseUser: vi.fn(),
  deleteFirebaseUser: vi.fn(),
  reauthenticateUser: vi.fn(),
}))

vi.mock('../services/userService', () => ({
  userStorageService: {
    syncLocalSession: vi.fn(),
    clearSession: vi.fn(),
  },
}))

vi.mock('../utils/imageUtils', () => ({
  compressImage: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('ProfilePage', () => {
  const mockedUseAuth = vi.mocked(useAuth)

  beforeEach(() => {
    vi.clearAllMocks()

    mockedUseAuth.mockReturnValue({
      user: {
        uid: 'u1',
        name: 'Test User',
        email: 'test@example.com',
        accessToken: 'token-123',
        lastLogin: '2023-01-01',
        photo: '',
        drafts: {},
        completedTasks: {},
      } as UserSession,
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      setDraftLocal: vi.fn(),
      saveDraftToCloud: vi.fn().mockResolvedValue(undefined),
      resetDraft: vi.fn().mockResolvedValue(undefined),
      updateTaskStatus: vi.fn().mockResolvedValue(undefined),
      updateChat: vi.fn().mockResolvedValue(undefined),
    } satisfies AuthContextType)

    vi.mocked(fetchFirestoreUserData).mockResolvedValue({
      name: 'Test User',
      country: 'Belarus',
      birthDate: '1990-01-01',
      phone: '+375291234567',
      photo: '',
    } satisfies ProfileValues)

    vi.mocked(compressImage).mockResolvedValue('data:image/png;base64,mock')
  })

  const renderPage = () =>
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    )

  it('successfully updates name and triggers session sync', async () => {
    const user = userEvent.setup()
    const { login } = mockedUseAuth()

    vi.mocked(userStorageService.syncLocalSession).mockReturnValue({
      uid: 'u1',
      name: 'New Name',
    } as UserSession)

    renderPage()

    const nameInput = await screen.findByPlaceholderText(/john doe/i)
    await user.clear(nameInput)
    await user.type(nameInput, 'New Name')

    await user.click(screen.getByRole('button', { name: /update profile/i }))

    await waitFor(() => {
      expect(updateFirebaseUser).toHaveBeenCalledWith(
        'u1',
        expect.objectContaining({ name: 'New Name' }),
      )
      expect(userStorageService.syncLocalSession).toHaveBeenCalled()
      expect(login).toHaveBeenCalled()
      expect(toast.success).toHaveBeenCalledWith('Profile updated successfully', expect.anything())
    })
  })

  it('handles image compression flow', async () => {
    renderPage()

    const file = new File(['img'], 'avatar.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(compressImage).toHaveBeenCalledWith(file, 300)
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining('Photo attached'),
        expect.anything(),
      )
    })
  })

  it('completes account deletion with password re-auth', async () => {
    const user = userEvent.setup()
    const { logout } = mockedUseAuth()
    vi.mocked(reauthenticateUser).mockResolvedValue({} as UserCredential)

    renderPage()

    const openModalBtn = await screen.findByRole('button', { name: /delete profile/i })
    await user.click(openModalBtn)

    const passInput = await screen.findByPlaceholderText('••••••••')

    await user.type(passInput, 'mypassword123')

    const confirmBtn = screen.getByRole('button', { name: /delete|confirm/i })
    await user.click(confirmBtn)

    await waitFor(() => {
      expect(reauthenticateUser).toHaveBeenCalledWith('mypassword123')
      expect(deleteFirebaseUser).toHaveBeenCalledWith('u1')
      expect(logout).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('prevents submission when Zod validation fails', async () => {
    const user = userEvent.setup()
    renderPage()

    const nameInput = await screen.findByPlaceholderText(/john doe/i)
    await user.clear(nameInput)
    await user.click(screen.getByRole('button', { name: /update profile/i }))

    expect(await screen.findByText(/at least 2 characters/i)).toBeInTheDocument()
    expect(updateFirebaseUser).not.toHaveBeenCalled()
  })
})
