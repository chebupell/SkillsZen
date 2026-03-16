import { createBrowserRouter } from 'react-router-dom';
import MainPage from '../pages/mainPage/mainPage';
import JSPage from '../pages/exercises/jsPage/jsPage';
import TSPage from '../pages/exercises/tsPage/tsPage';
import AlgorithmsPage from '../pages/exercises/algorithmsPage/algorithmsPage';
import StatsPage from '../pages/stats/stats';
import { AuthPage } from '../pages/auth/auth';
import Menu from '../pages/menuPage/menuPage';
import { LoginPage } from '../pages/login/login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
    children: [
      {
        index: true,
        element: <Menu />,
      },
      {
        index: true,
        element: <Menu />,
      },
      {
        path: 'signup',
        element: <AuthPage />,
      },
      {
        path: 'signin',
        element: <LoginPage />,
      },
      {
        path: 'signin',
        element: <LoginPage />,
      },
      {
        path: 'js',
        element: <JSPage />,
      },
      {
        path: 'ts',
        element: <TSPage />,
      },
      {
        path: 'algo',
        element: <AlgorithmsPage />,
      },
      {
        path: 'stats',
        element: <StatsPage />,
      },
    ],
  },
]);