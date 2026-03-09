import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { AuthFormLayout } from '../../components/shared/AuthFormLayout'
import type { AuthValues } from '../../types/types'
import { signinService } from '../../services/login'
import { useNavigate } from 'react-router-dom'
import { userStorageService } from '../../services/userService'
import { useAuth } from '../../services/AuthContext'

const loginSchema = z.object({
  login: z.string().min(1, 'Login is required'),
  password: z.string().min(1, 'Password is required'),
})

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const handleLogin = async (data: AuthValues) => {
    try {
      const credential = await signinService(data.login, data.password)
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
      title="Sign in"
      resolver={zodResolver(loginSchema)}
      onSubmit={handleLogin}
      loginLabel="Username"
      buttonText="Sign In"
      linkDescription="Don't have an account?"
      linkText="Sign up"
      linkHref="/sign-up"
    />
  )
}
