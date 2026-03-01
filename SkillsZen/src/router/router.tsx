import { createBrowserRouter } from 'react-router-dom';
import MainPage from '../pages/mainPage/mainPage';
import JSPage from '../pages/exercises/jsPage/jsPage';
import TSPage from '../pages/exercises/tsPage/tsPage';
import AlgorithmsPage from '../pages/exercises/algorithmsPage/algorithmsPage';
import StatsPage from '../pages/stats/stats';
import { AuthPage } from '../pages/auth/auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
    children: [
      {
        path: 'auth',
        element: <AuthPage />,
      },
      {
        path: 'exercises/js',
        element: <JSPage />,
      },
      {
        path: 'exercises/ts',
        element: <TSPage />,
      },
      {
        path: 'exercises/algo',
        element: <AlgorithmsPage />,
      },
      {
        path: 'stats',
        element: <StatsPage />,
      },
    ],
  },
]);