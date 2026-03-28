import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Loader2, ArrowRight } from 'lucide-react'
import type { AuthFormProps, AuthValues } from '../../types/types'

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
  } = useForm<AuthValues>({
    resolver,
    mode: 'onChange',
  })

  return (
    <div className="flex flex-col justify-center flex-1 px-4 bg-[url('/background-images/auth-page-background.png')] bg-cover bg-center bg-fixed relative">
      <Card className="max-w-100 mx-auto w-full border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-8">
          <CardTitle className="text-3xl font-bold tracking-tight text-center">{title}</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {isSignUp ? 'Create an account to get started' : 'Welcome back'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
            {isSignUp && (
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-sm font-medium ml-1">
                  User Name
                </Label>
                <Input
                  id="username"
                  placeholder="John Doe"
                  {...register('username')}
                  className={`h-11 rounded-xl transition-all focus:ring-2 ${
                    errors.username
                      ? 'border-destructive focus-visible:ring-destructive'
                      : 'focus-visible:ring-primary'
                  }`}
                />
                {errors.username && (
                  <p className="text-[11px] font-medium text-destructive ml-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="login" className="text-sm font-medium ml-1">
                {loginLabel}
              </Label>
              <Input
                id="login"
                placeholder="name@example.com"
                {...register('login')}
                className={`h-11 rounded-xl transition-all focus:ring-2 ${
                  errors.login
                    ? 'border-destructive focus-visible:ring-destructive'
                    : 'focus-visible:ring-primary'
                }`}
              />
              {errors.login && (
                <p className="text-[11px] font-medium text-destructive ml-1">
                  {errors.login.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className={`h-11 rounded-xl transition-all focus:ring-2 ${
                  errors.password
                    ? 'border-destructive focus-visible:ring-destructive'
                    : 'focus-visible:ring-primary'
                }`}
              />
              {errors.password && (
                <p className="text-[11px] font-medium text-destructive ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-semibold transition-all active:scale-[0.98] mt-2 group"
              disabled={!isValid || isSubmitting}
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
