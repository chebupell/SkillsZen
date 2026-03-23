import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router'
import './index.css'
import { AuthProvider } from './services/AuthContext'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './components/shared/ErrorFallback'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
