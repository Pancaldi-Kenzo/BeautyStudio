import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const isAuthenticated = sessionStorage.getItem('isAdminAuth') === 'true';

  // Si non connecté, redirection vers la page de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si connecté, on affiche la page admin demandée
  return <Outlet />;
}