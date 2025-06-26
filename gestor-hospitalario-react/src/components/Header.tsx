import React from 'react';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Sistema de Gestión Hospitalaria' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo-container">
            <h1>{title}</h1>
          </div>
          {user && (
            <div className="user-info">
              <span>Bienvenido, {user.nombre} {user.apellido}</span>
              <button onClick={handleLogout} className="btn btn-outline btn-small">
                <i className="fas fa-sign-out-alt"></i>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
