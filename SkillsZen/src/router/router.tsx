import { createBrowserRouter } from 'react-router-dom'
import MainPage from '../pages/mainPage/mainPage'
import CoursePage from '../pages/exercises/coursePage/coursePage'
import StatsPage from '../pages/stats/stats'
import { AuthPage } from '../pages/auth/authPage'
import Menu from '../pages/menuPage/menuPage'
import { LoginPage } from '../pages/login/loginPage'
import { ProtectedRoute } from './protectedRoute'
import { ProfilePage } from '../pages/profilePage/ProfilePage'
import { ErrorFallback } from '../components/shared/ErrorFallback'
import { NotFound } from '../pages/404Page/notFound'

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
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
