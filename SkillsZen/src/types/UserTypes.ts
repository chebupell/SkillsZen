import type { Resolver } from 'react-hook-form'
import z from 'zod'
import type { ChatMessage } from './chatTypes'
import type { User, UserCredential } from 'firebase/auth'

export const authFieldsSchema = z.object({
  login: z.string(),
  password: z.string(),
  username: z.string().optional(),
})

export type AuthValues = z.infer<typeof authFieldsSchema>

export interface AuthFormProps {
  title: string
  resolver: Resolver<AuthValues>
  onSubmit: (data: AuthValues) => Promise<void>
  buttonText: string
  loginLabel: string
  linkText: string
  linkHref: string
  linkDescription: string
  isSignUp?: boolean
}

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  country: z.string().min(2, 'Please enter a valid country name'),
  birthDate: z.string().refine((date) => {
    const birth = new Date(date)
    const now = new Date()
    return birth < now
  }, 'Invalid birth date'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
  photo: z.string().optional(),
})

export type ProfileValues = z.infer<typeof profileSchema>

export interface UserSession {
  readonly uid: string
  email: string | null
  accessToken: string
  lastLogin: string
  name: string | null
  photo: string | null
  photoFile?: File
  completedTasks?: Record<string, 'passed' | 'failed'>
  chatHistory?: ChatMessage[]
  drafts?: Record<string, string>
}


export interface SigninResponse {
  user: User
  profile?: ProfileValues
  credential: UserCredential
}
