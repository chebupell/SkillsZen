import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../services/AuthContext'
import { profileSchema, type ProfileValues } from '../../types/types'
import { userStorageService } from '../../services/userService'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import {
  deleteFirebaseUser,
  fetchFirestoreUserData,
  updateFirebaseUser,
} from '../../services/login'
import { DeleteAccountModal } from '../../components/shared/DeleteAccountModal'
import { useNavigate } from 'react-router-dom'
import { FirebaseError } from 'firebase/app'
import { toast } from 'sonner'

export function ProfilePage() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      country: '',
      birthDate: '',
      phone: '',
    },
  })

  useEffect(() => {
    if (user?.uid) {
      fetchFirestoreUserData(user.uid).then((data) => {
        if (data) {
          const profile = data as ProfileValues
          reset({
            name: profile.name || user.name || '',
            country: profile.country || '',
            birthDate: profile.birthDate || '',
            phone: profile.phone || '',
          })
        }
      })
    }
  }, [user?.uid, reset, user?.name])

  const onSubmit = async (data: ProfileValues) => {
    try {
      if (!user?.uid) return
      await updateFirebaseUser(user.uid, data)

      const updatedSession = userStorageService.syncLocalSession(data.name)
      if (updatedSession) {
        login(updatedSession)
      }
      toast.success('Profile updated successfully', {
        description: 'Your changes have been saved to the cloud.',
        duration: 3000,
      })
    } catch (error) {
      toast.error('Failed to update profile', {
        description: 'Please try again later.',
        duration: 3000,
      })
    }
  }

  const handleDeleteAccount = async () => {
    if (!user?.uid) return

    setIsDeleting(true)
    try {
      await deleteFirebaseUser(user.uid)
      userStorageService.clearSession()
      logout()
      navigate('/signup')
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/requires-recent-login') {
          alert('Security: Please log in again before deleting your account.')
        } else {
          alert(`Error: ${error.message}`)
        }
      } else {
        console.error('Non-firebase error:', error)
        alert('An unexpected error occurred.')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="w-full py-10 flex flex-col items-center bg-[url('/background-images/main-page-background.png')] bg-cover bg-center min-h-screen px-4">
      <Card className="w-full max-w-2xl bg-background/90 backdrop-blur-sm mb-6">
        <CardHeader className="flex flex-row items-center gap-6">
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={user?.photo || ''} />
            <AvatarFallback>{(user?.name?.[0] || 'U').toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user?.name}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                {...register('country')}
                className={errors.country ? 'border-destructive' : ''}
              />
              {errors.country && (
                <p className="text-xs text-destructive">{errors.country.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                {...register('birthDate')}
                className={errors.birthDate ? 'border-destructive' : ''}
              />
              {errors.birthDate && (
                <p className="text-xs text-destructive">{errors.birthDate.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl border-destructive/50 bg-destructive/5 backdrop-blur-sm mt-6">
        <CardHeader>
          <CardTitle className="text-destructive text-lg">Danger Zone</CardTitle>
          <CardDescription>Account deletion is permanent and wipes all your data.</CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountModal onConfirm={handleDeleteAccount} isDeleting={isDeleting} />
        </CardContent>
      </Card>
    </div>
  )
}
