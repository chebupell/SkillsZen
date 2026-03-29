import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../services/AuthContext'
import { profileSchema, type ProfileValues } from '../../types/UserTypes'
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
} from '../../services/firebase'
import { DeleteAccountModal } from '../../components/shared/DeleteAccountModal'
import { useNavigate } from 'react-router-dom'
import { FirebaseError } from 'firebase/app'
import { toast } from 'sonner'
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react'

export default function ProfilePage() {
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
      toast.error(`Failed to update profile. ${error}`, {
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
      navigate('/')
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
    <div className="flex flex-col items-center min-h-screen px-4 py-12 bg-[url('/background-images/main-page-background.webp')] bg-cover bg-center">
      <Card className="w-full max-w-2xl border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-md rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-6 pb-8 border-b border-border/50 bg-primary/5">
          <Avatar className="h-20 w-20 border-2 border-background shadow-sm">
            <AvatarImage src={user?.photo || ''} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {(user?.name?.[0] || 'U').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">{user?.name}</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              {user?.email}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium ml-1">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Your Name"
                {...register('name')}
                className={`h-11 rounded-xl transition-all focus:ring-2 ${
                  errors.name
                    ? 'border-destructive focus-visible:ring-destructive'
                    : 'focus-visible:ring-primary'
                }`}
              />
              {errors.name && (
                <p className="text-[11px] font-medium text-destructive ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="country" className="text-sm font-medium ml-1">
                  Country
                </Label>
                <Input
                  id="country"
                  placeholder="USA"
                  {...register('country')}
                  className={`h-11 rounded-xl transition-all focus:ring-2 ${
                    errors.country
                      ? 'border-destructive focus-visible:ring-destructive'
                      : 'focus-visible:ring-primary'
                  }`}
                />
                {errors.country && (
                  <p className="text-[11px] font-medium text-destructive ml-1">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="birthDate" className="text-sm font-medium ml-1">
                  Birth Date
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  {...register('birthDate')}
                  className={`h-11 rounded-xl transition-all focus:ring-2 ${
                    errors.birthDate
                      ? 'border-destructive focus-visible:ring-destructive'
                      : 'focus-visible:ring-primary'
                  }`}
                />
                {errors.birthDate && (
                  <p className="text-[11px] font-medium text-destructive ml-1">
                    {errors.birthDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-sm font-medium ml-1">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...register('phone')}
                className={`h-11 rounded-xl transition-all focus:ring-2 ${
                  errors.phone
                    ? 'border-destructive focus-visible:ring-destructive'
                    : 'focus-visible:ring-primary'
                }`}
              />
              {errors.phone && (
                <p className="text-[11px] font-medium text-destructive ml-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-semibold transition-all active:scale-[0.98] mt-4 group"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Save Changes{' '}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="w-full max-w-2xl border-none shadow-xl shadow-destructive/5 bg-destructive/5 backdrop-blur-md rounded-2xl mt-8">
        <CardHeader className="pb-4">
          <CardTitle className="text-destructive text-lg font-bold flex items-center gap-2">
            <AlertCircle className="h-5 w-5" /> Danger Zone
          </CardTitle>
          <CardDescription className="text-destructive/80">
            Account deletion is permanent and wipes all your data. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountModal onConfirm={handleDeleteAccount} isDeleting={isDeleting} />
        </CardContent>
      </Card>
    </div>
  )
}
