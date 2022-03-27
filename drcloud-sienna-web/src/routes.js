import { Navigate } from 'react-router';
import Home from '@views/Home';

const routes = [
  {
    path: '/mb',
    element: <Home />
  },
  {
    path: '*',
    element: <Navigate to="/mb" />
  }
];

export default routes;
