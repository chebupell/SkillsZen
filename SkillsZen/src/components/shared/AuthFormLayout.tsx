import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import type { AuthFormProps, AuthValues } from '../../types/types';

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
  });

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto p-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {isSignUp && (
              <div className="grid gap-2">
                <Label htmlFor="username">User Name</Label>
                <Input
                  id="username"
                  placeholder="John Doe"
                  {...register('username')}
                  className={errors.username ? 'border-destructive' : ''}
                />
                {errors.username && (
                  <p className="text-xs text-destructive">{errors.username.message}</p>
                )}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="login">{loginLabel}</Label>
              <Input
                id="login"
                {...register('login')}
                className={errors.login ? 'border-destructive' : ''}
              />
              {errors.login && (
                <p className="text-xs text-destructive">{errors.login.message}</p>
              )}
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

            <Button type="submit" className="w-full" disabled={!isValid || isSubmitting}>
              {isSubmitting ? 'Processing...' : buttonText}
            </Button>

            <div className="text-center text-sm">
              {linkDescription}{' '}
              <Link to={linkHref} className="underline underline-offset-4">
                {linkText}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

