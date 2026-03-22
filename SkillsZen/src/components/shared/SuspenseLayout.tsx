import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { PageLoader } from './PageLoader'

export const SuspenseLayout = () => {
  const location = useLocation()

  return (
    <Suspense key={location.pathname} fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  )
}
