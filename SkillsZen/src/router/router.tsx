import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import MainPage from '../pages/mainPage/mainPage'
import { ProtectedRoute } from './protectedRoute'
import { ErrorFallback } from '../components/shared/ErrorFallback'
import { NotFound } from '../pages/404Page/notFound'
import Menu from '../pages/menuPage/menuPage'
import { SuspenseLayout } from '../components/shared/SuspenseLayout'


const AuthPage = lazy(() => import('../pages/auth/authPage').then((m) => ({ default: m.AuthPage })))
const LoginPage = lazy(() => import('../pages/login/loginPage').then((m) => ({ default: m.LoginPage })))
const JSPage = lazy(() => import('../pages/exercises/jsPage/jsPage'))
const TSPage = lazy(() => import('../pages/exercises/tsPage/tsPage'))
const AlgorithmsPage = lazy(() => import('../pages/exercises/algorithmsPage/algorithmsPage'))
const CodingTasks = lazy(() => import('../pages/coding/CodingTasks'))
const EditorPage = lazy(() => import('../pages/coding/EditorPage'))
const StatsPage = lazy(() => import('../pages/stats/stats'))
const ProfilePage = lazy(() => import('../pages/profilePage/ProfilePage'))


export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
    errorElement: <ErrorFallback />,
    children: [
      {
        element: <SuspenseLayout />,
        children: [
          { path: 'sign-up', element: <AuthPage /> },
          { path: 'sign-in', element: <LoginPage /> },
        ]
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <SuspenseLayout />,
            children: [
              { index: true, element: <Menu /> },
              { path: 'js', element: <JSPage /> },
              { path: 'ts', element: <TSPage /> },
              { path: 'algo', element: <AlgorithmsPage /> },
              { 
                path: 'coding-tasks', 
                children: [
                  { index: true, element: <CodingTasks /> },
                  { path: 'editor/:taskId', element: <EditorPage /> },
                ] 
              },
              { path: 'stats', element: <StatsPage /> },
              { path: 'profile', element: <ProfilePage /> },
            ]
          }
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])

