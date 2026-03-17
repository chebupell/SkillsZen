import { createBrowserRouter } from 'react-router-dom'
import MainPage from '../pages/mainPage/mainPage'
import JSPage from '../pages/exercises/jsPage/jsPage'
import TSPage from '../pages/exercises/tsPage/tsPage'
import AlgorithmsPage from '../pages/exercises/algorithmsPage/algorithmsPage'
import StatsPage from '../pages/stats/stats'
import { AuthPage } from '../pages/auth/auth'
import Menu from '../pages/menuPage/menuPage'
import { LoginPage } from '../pages/login/login'
import { ProtectedRoute } from './protectedRoute'
import { ProfilePage } from '../pages/profilePage/ProfilePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
    children: [
      {
        path: 'signup',
        element: <AuthPage />,
      },
      {
        path: 'signin',
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
        ],
      },
    ],
  },
])
