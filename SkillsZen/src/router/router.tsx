import { createBrowserRouter } from 'react-router-dom';
import MainPage from '../pages/mainPage/mainPage';
import JSPage from '../pages/exercises/jsPage/jsPage';
import TSPage from '../pages/exercises/tsPage/tsPage';
import AlgorithmsPage from '../pages/exercises/algorithmsPage/algorithmsPage';
import StatsPage from '../pages/stats/stats';
import PracticePage from '../pages/exercises/practice/practicePage';
import { AuthPage } from '../pages/auth/auth';
import Menu from '../pages/menuPage/menuPage';

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
        path: 'auth',
        element: <AuthPage />,
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
        path: 'practice/:blockId',
        element: <PracticePage />
      },
      {
        path: 'stats',
        element: <StatsPage />,
      },
    ],
  },
]);