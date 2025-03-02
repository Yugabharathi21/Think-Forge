import { RouteObject } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Chat from '../pages/Chat';
import Home from '../pages/Home';
import ProtectedRoute from '../components/ProtectedRoute';
import NotFound from '../pages/NotFound';

// Public routes that don't require authentication
export const publicRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
];

// Protected routes that require authentication
export const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedRoute><Home /></ProtectedRoute>,
  },
  {
    path: '/chat',
    element: <ProtectedRoute><Chat /></ProtectedRoute>,
  },
  {
    path: '/c/:conversationId',
    element: <ProtectedRoute><Chat /></ProtectedRoute>,
  },
];

// Error routes
export const errorRoutes: RouteObject[] = [
  {
    path: '*',
    element: <NotFound />,
  },
];

// Combine all routes
export const routes: RouteObject[] = [
  ...publicRoutes,
  ...protectedRoutes,
  ...errorRoutes,
]; 