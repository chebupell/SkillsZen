import { createBrowserRouter } from 'react-router-dom';
import AuthPage from '../pages/auth/auth';
import MainPage from '../pages/main/main';
import JSPage from '../pages/exercises/jsPage/jsPage';
import TSPage from '../pages/exercises/tsPage/tsPage';
import AlgorithmsPage from '../pages/exercises/algorithmsPage/algorithmsPage';
import StatsPage from '../pages/stats/stats';
import App from '../App';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'main',
        element: <MainPage />,
      },
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