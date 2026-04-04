import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import { Loader2, ArrowRight } from 'lucide-react'
import type { AuthFormProps, AuthValues } from '../../../types/UserTypes'
import { AuthHeader } from './AuthHeader'
import { FormInput } from './FormInput'

export function AuthFormLayout({
  title,
  resolver,
  onSubmit,
  buttonText,
  loginLabel,
  linkText,
  linkHref,
  linkDescription,
  isSignUp,
}: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<AuthValues>({ resolver, mode: 'onChange' })

  return (
    <div className="min-h-full w-full flex flex-col flex-1 justify-center items-center p-4 bg-[url('/background-images/auth-page-background.webp')] bg-cover bg-center relative">
      <Card className="max-w-100 mx-auto w-full border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-sm">
        <AuthHeader title={title} isSignUp={isSignUp} />

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
            {isSignUp && (
              <FormInput
                id="username"
                label="User Name"
                placeholder="John Doe"
                register={register('username')}
                error={errors.username}
              />
            )}

            <FormInput
              id="login"
              label={loginLabel}
              placeholder="name@example.com"
              register={register('login')}
              error={errors.login}
            />

            <FormInput
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              register={register('password')}
              error={errors.password}
            />

            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full h-11 rounded-xl font-semibold transition-all active:scale-[0.98] mt-2 group"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  {buttonText}{' '}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              {linkDescription}{' '}
              <Link
                to={linkHref}
                className="text-primary font-semibold hover:underline underline-offset-4 decoration-2"
              >
                {linkText}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
