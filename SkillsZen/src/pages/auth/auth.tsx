import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'

const signupSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine((val) => /[A-Z]/.test(val), 'Must contain an uppercase letter')
    .refine((val) => /[a-z]/.test(val), 'Must contain a lowercase letter')
    .refine((val) => /[0-9]/.test(val), 'Must contain a number')
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), 'Must contain a special character'),
})

type SignupFormValues = z.infer<typeof signupSchema>

export function AuthPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  })

  const formValues = useWatch({ control })

  useEffect(() => {
    if (formValues.email && formValues.password) {
      console.log('Form changed:', formValues)
    }
  }, [formValues])

  const onSubmit = (data: SignupFormValues) => {
    console.log('Submit Data:', data)
  }

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full text-black" disabled={!isValid}>
              Create Account
            </Button>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link to="/sign-in" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
