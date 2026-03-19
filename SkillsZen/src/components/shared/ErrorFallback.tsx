import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Button } from '../ui/button'
import type { FallbackProps } from 'react-error-boundary'

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex items-center justify-center p-6 w-full min-h-[200px]">
      <Card className="w-full max-w-md border-destructive/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <CardTitle>Component Error</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="bg-destructive/5 border-none">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="font-mono text-xs mt-2 opacity-80">
              {error instanceof Error ? error.message : String(error)}
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex gap-3 justify-end">
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/')}>
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="default" size="sm" onClick={resetErrorBoundary}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
