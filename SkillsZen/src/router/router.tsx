import { createBrowserRouter } from 'react-router-dom'
import MainPage from '../pages/mainPage/mainPage'
import CoursePage from '../pages/exercises/coursePage/coursePage'
import { AuthPage } from '../pages/auth/authPage'
import Menu from '../pages/menuPage/menuPage'
import { LoginPage } from '../pages/login/loginPage'
import { ProtectedRoute } from './protectedRoute'
import { ProfilePage } from '../pages/profilePage/ProfilePage'
import { ErrorFallback } from '../components/shared/ErrorFallback'
import { NotFound } from '../pages/404Page/notFound'
import TsCards from '../pages/exercises/tsCardsPage/tsCardsPage'
import PracticePage from '../pages/exercises/practice/practicePage'
import BlockResultPage from '../pages/exercises/blockResultPage/blockResultPage'
import StatsPage from '../pages/stats/stats'

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
          { path: 'js', element: ( <CoursePage courseId="js_course" backgroundImage="js-page-background.png" /> ) },
          { path: 'ts', element: ( <CoursePage courseId="ts_course" backgroundImage="ts-page-background.png" /> ) },
          { path: 'algo', element: ( <CoursePage courseId="algo_course" backgroundImage="algo-page-background.png" /> ) },
          { path: 'practice/:blockId', element: <PracticePage /> },
          { path: 'results', element: <BlockResultPage /> },
          { path: 'stats', element: <StatsPage /> },
          { path: 'ts-cards', element: ( <TsCards/>)},

        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
