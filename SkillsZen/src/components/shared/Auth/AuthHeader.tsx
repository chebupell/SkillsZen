import { CardDescription, CardHeader, CardTitle } from '../../ui/card'

export const AuthHeader = ({ title, isSignUp }: { title: string; isSignUp?: boolean }) => (
  <CardHeader className="space-y-1 pb-8 text-center">
    <CardTitle className="text-3xl font-bold tracking-tight">{title}</CardTitle>
    <CardDescription className="text-muted-foreground">
      {isSignUp ? 'Create an account to get started' : 'Welcome back'}
    </CardDescription>
  </CardHeader>
)
