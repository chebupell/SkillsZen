import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate } from 'react-router-dom'
import { signupService } from '../../services/firebase'
import { AuthFormLayout } from '../../components/shared/AuthFormLayout'
import { userStorageService } from '../../services/userService'
import { useAuth } from '../../services/AuthContext'

const signupSchema = z.object({
  username: z.string().min(2, 'Name must be at least 2 characters').optional(),
  login: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine((val) => /[A-Z]/.test(val), 'Must contain an uppercase letter')
    .refine((val) => /[a-z]/.test(val), 'Must contain a lowercase letter')
    .refine((val) => /[0-9]/.test(val), 'Must contain a number')
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), 'Must contain a special character'),
})
export function AuthPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSignup = async (data: z.infer<typeof signupSchema>) => {
    try {
      const credential = await signupService(data.login, data.password, data.username)

      await userStorageService.saveSession(credential)
      const session = userStorageService.getSession()

      if (session) {
        login(session)
        navigate('/')
      }
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  return (
    <AuthFormLayout
      title="Sign up"
      resolver={zodResolver(signupSchema)}
      onSubmit={handleSignup}
      loginLabel="Email"
      buttonText="Create Account"
      linkDescription="Already have an account?"
      linkText="Sign in"
      linkHref="/sign-in"
      isSignUp={true}
    />
  )
}
