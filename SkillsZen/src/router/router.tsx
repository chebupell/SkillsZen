import { createBrowserRouter } from 'react-router-dom'
import MainPage from '../pages/mainPage/mainPage'
import JSPage from '../pages/exercises/jsPage/jsPage'
import TSPage from '../pages/exercises/tsPage/tsPage'
import AlgorithmsPage from '../pages/exercises/algorithmsPage/algorithmsPage'
import StatsPage from '../pages/stats/stats'
import { AuthPage } from '../pages/auth/authPage'
import Menu from '../pages/menuPage/menuPage'
import { LoginPage } from '../pages/login/loginPage'
import { ProtectedRoute } from './protectedRoute'
import { ProfilePage } from '../pages/profilePage/ProfilePage'
import { ErrorFallback } from '../components/shared/ErrorFallback'
import { NotFound } from '../pages/404Page/notFound'
import PracticePage from '../pages/exercises/practice/practicePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
    errorElement: <ErrorFallback />,
    children: [
      {
        path: 'sign-up',
        element: <AuthPage />,
      },
      {
        path: 'sign-in',
        element: <LoginPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Menu />,
          },
          { path: 'js', element: <JSPage /> },
          { path: 'ts', element: <TSPage /> },
          { path: 'algo', element: <AlgorithmsPage /> },
          { path: 'stats', element: <StatsPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'practice/:blockId', element: <PracticePage />}
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
