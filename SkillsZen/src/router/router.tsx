import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import MainPage from '../pages/mainPage/mainPage'
import CoursePage from '../pages/exercises/coursePage/coursePage'
import Menu from '../pages/menuPage/menuPage'
import { ProtectedRoute } from './protectedRoute'
import { ErrorFallback } from '../components/shared/ErrorFallback'
import { NotFound } from '../pages/404Page/notFound'
import TsCards from '../pages/exercises/tsCardsPage/tsCardsPage'
import PracticePage from '../pages/exercises/practice/practicePage'
import BlockResultPage from '../pages/exercises/blockResultPage/blockResultPage'
import { SuspenseLayout } from '../components/shared/SuspenseLayout'

const AuthPage = lazy(() => import('../pages/auth/authPage').then((m) => ({ default: m.AuthPage })))
const LoginPage = lazy(() =>
  import('../pages/login/loginPage').then((m) => ({ default: m.LoginPage })),
)
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
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <SuspenseLayout />,
            children: [
              { index: true, element: <Menu /> },
              {
                path: 'coding-tasks',
                children: [
                  { index: true, element: <CodingTasks /> },
                  { path: 'editor/:taskId', element: <EditorPage /> },
                ],
              },
              { path: 'profile', element: <ProfilePage /> },
              {
                path: 'js',
                element: (
                  <CoursePage courseId="js_course" backgroundImage="js-page-background.png" />
                ),
              },
              {
                path: 'ts',
                element: (
                  <CoursePage courseId="ts_course" backgroundImage="ts-page-background.png" />
                ),
              },
              {
                path: 'algo',
                element: (
                  <CoursePage courseId="algo_course" backgroundImage="algo-page-background.png" />
                ),
              },
              { path: 'practice/:blockId', element: <PracticePage /> },
              { path: 'results', element: <BlockResultPage /> },
              { path: 'ts-cards', element: <TsCards /> },
              { path: 'stats', element: <StatsPage /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
