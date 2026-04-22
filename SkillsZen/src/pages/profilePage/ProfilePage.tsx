import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../services/AuthContext'
import { profileSchema, type ProfileValues } from '../../types/UserTypes'
import { userStorageService } from '../../services/userService'
import { Card, CardContent } from '../../components/ui/card'
import {
  deleteFirebaseUser,
  fetchFirestoreUserData,
  reauthenticateUser,
  updateFirebaseUser,
} from '../../services/firebase'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ProfileHeader } from '../../components/shared/Profile/ProfileHeader'
import { ProfileForm } from '../../components/shared/Profile/ProfileForm'
import { DeleteProfile } from '../../components/shared/Profile/DeleteProfile'

export default function ProfilePage() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      country: '',
      birthDate: '',
      phone: '',
      photo: user?.photo || '', 
    },
  })

  useEffect(() => {
    if (user?.uid) {
      fetchFirestoreUserData(user.uid).then((data) => {
        if (data) {
          const profile = data as ProfileValues
          form.reset({
            name: profile.name || user.name || '',
            country: profile.country || '',
            birthDate: profile.birthDate || '',
            phone: profile.phone || '',
            photo: profile.photo || user.photo || '',
          })
        }
      })
    }
  }, [user?.uid, form.reset, user?.name, user?.photo])

  const onSubmit = async (data: ProfileValues) => {
    const toastId = toast.loading('Updating profile...') 

    try {
      if (!user?.uid) throw new Error('User not found')

      await updateFirebaseUser(user.uid, data)

      const updatedSession = userStorageService.syncLocalSession({
        name: data.name,
        photo: data.photo, 
      })
      if (updatedSession) {
        login(updatedSession)
      }

      toast.success('Profile updated successfully', { id: toastId })
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Failed to update: ${msg}`, { id: toastId })
    }
  }

  const handleDeleteAccount = async (password: string) => {
    if (!user?.uid) return
    setIsDeleting(true)
    try {
      await reauthenticateUser(password)
      await deleteFirebaseUser(user.uid)
      userStorageService.clearSession()
      logout()
      navigate('/')
      toast.success('Profile deleted')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Deletion failed'

      toast.error(message || 'Verification Failed')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
        <div className="max-w-3xl mx-auto w-full flex flex-col items-center gap-4 animate-in fade-in duration-500">
          <Card className="w-full max-w-xl border border-white/20 shadow-xl p-0 bg-white/60 backdrop-blur-xl rounded-[2rem] overflow-hidden">
            <ProfileHeader user={user} />

            <CardContent className="pt-4 px-6 pb-6">
              <ProfileForm
                form={form}
                onSubmit={onSubmit}
                isSubmitting={form.formState.isSubmitting}
              />
            </CardContent>
          </Card>

          <div className="w-full max-w-xl mb-4">
            <DeleteProfile onDelete={handleDeleteAccount} isDeleting={isDeleting} />
          </div>
        </div>
      </div>
    </div>
  )
}
