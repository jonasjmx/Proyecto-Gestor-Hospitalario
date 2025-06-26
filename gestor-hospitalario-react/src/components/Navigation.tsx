import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  return (
    <nav className={`nav-menu ${className}`}>
      <div className="container">
        <ul>
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <i className="fas fa-chart-line"></i>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/centros-medicos" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <i className="fas fa-hospital"></i>
              Centros Médicos
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/consultas" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <i className="fas fa-stethoscope"></i>
              Consultas Médicas
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/empleados" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <i className="fas fa-users"></i>
              Empleados
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/especialidades" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <i className="fas fa-user-md"></i>
              Especialidades
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/medicos" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <i className="fas fa-user-doctor"></i>
              Médicos
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
