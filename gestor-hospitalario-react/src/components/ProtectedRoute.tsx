import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredRoles?: string[];
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredRoles,
  requiredPermission
}) => {
  const { isAuthenticated, loading, hasRole, hasAnyRole, hasPermission } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Verificando autenticación...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized
  return <>{children}</>;
};

export const UnauthorizedPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-container">
        <div className="unauthorized-icon">
          <svg 
            width="80" 
            height="80" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        
        <h1>Acceso No Autorizado</h1>
        
        <div className="unauthorized-content">
          <p>Lo sentimos, no tienes permisos para acceder a esta página.</p>
          
          {user && (
            <div className="user-info">
              <p><strong>Usuario:</strong> {user.nombre}</p>
              <p><strong>Rol:</strong> {user.rol}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          )}
          
          <div className="unauthorized-suggestions">
            <h3>¿Qué puedes hacer?</h3>
            <ul>
              <li>Verifica que tengas el rol adecuado para esta función</li>
              <li>Contacta al administrador del sistema si necesitas permisos adicionales</li>
              <li>Regresa a una página donde tengas acceso</li>
            </ul>
          </div>
        </div>
        
        <div className="unauthorized-actions">
          <button 
            onClick={handleGoBack}
            className="btn btn-secondary"
          >
            Volver Atrás
          </button>
          
          <button 
            onClick={handleGoToDashboard}
            className="btn btn-primary"
          >
            Ir al Dashboard
          </button>
          
          <button 
            onClick={handleLogout}
            className="btn btn-outline"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};
