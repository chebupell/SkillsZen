import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { AuthFormLayout } from '../../components/shared/AuthFormLayout'
import type { AuthValues } from '../../types/UserTypes'
import { signinService } from '../../services/firebase'
import { useNavigate } from 'react-router-dom'
import { userStorageService } from '../../services/userService'
import { useAuth } from '../../services/AuthContext'
import { toast } from 'sonner'

const loginSchema = z.object({
  login: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine((val) => /[A-Z]/.test(val), 'Must contain an uppercase letter')
    .refine((val) => /[a-z]/.test(val), 'Must contain a lowercase letter')
    .refine((val) => /[0-9]/.test(val), 'Must contain a number')
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), 'Must contain a special character'),
  username: z.string().optional(),
})

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const handleLogin = async (data: AuthValues) => {
    try {
      const { user, profile } = await signinService(data.login, data.password)
      await userStorageService.saveSession(user, profile)
      const session = userStorageService.getSession()

      // 4. Now 'session' is type 'UserSession | null', which matches your login() function
      if (session) {
        login(session)
        navigate('/')
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Authentication failed'
      toast.error(message)
    }
  }

  return (
    <AuthFormLayout
      title="Sign in"
      resolver={zodResolver(loginSchema)}
      onSubmit={handleLogin}
      loginLabel="User email"
      buttonText="Sign In"
      linkDescription="Don't have an account?"
      linkText="Sign up"
      linkHref="/sign-up"
    />
  )
}
