import { AlertCircle, RotateCcw, Home, Terminal } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Button } from '../ui/button'
import type { FallbackProps } from 'react-error-boundary'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export function ErrorFallback({
  error: boundaryError,
  resetErrorBoundary,
}: Partial<FallbackProps>) {
  const routeError = useRouteError()
  const error = routeError || boundaryError

  let message = 'An unknown error occurred'
  let title = 'Application Error'

  if (isRouteErrorResponse(error)) {
    title = `Error ${error.status}`
    message = error.statusText || error.data?.message || message
  } else if (error instanceof Error) {
    message = error.message
  } else if (typeof error === 'string') {
    message = error
  }

  const handleReset = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="flex items-center justify-center p-6 w-full min-h-100 animate-in fade-in duration-500">
      <Card className="w-full max-w-md border-destructive/20 shadow-xl bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <CardTitle className="text-xl tracking-tight">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
            <Terminal className="h-4 w-4" />
            <AlertTitle className="font-semibold text-xs uppercase tracking-wider opacity-70">
              Stack Trace / Message
            </AlertTitle>
            <AlertDescription className="font-mono text-[11px] mt-2 leading-relaxed break-all min-h-37.5 overflow-auto custom-scrollbar">
              {message}
            </AlertDescription>
          </Alert>
          <p className="text-sm text-muted-foreground text-center px-2">
            The application encountered an unexpected error. Try reloading or return to the home
            page.
          </p>
        </CardContent>
        <CardFooter className="flex gap-2 justify-center pt-2 pb-6">
          <Button variant="outline" className="flex-1" onClick={() => (window.location.href = '/')}>
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="default" className="flex-1" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
