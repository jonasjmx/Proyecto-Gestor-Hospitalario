import React from 'react';
import { useAuth } from '../hooks';
import LoadingSpinner from './LoadingSpinner';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { MedicoDashboard } from './dashboards/MedicoDashboard';
import { EmpleadoDashboard } from './dashboards/EmpleadoDashboard';
import { PacienteDashboard } from './dashboards/PacienteDashboard';
import '../styles/dashboard.css';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="dashboard-error">
        <h2>Error de Autenticación</h2>
        <p>No se pudo cargar la información del usuario.</p>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user.rol) {
      case 'Administrador':
        return <AdminDashboard />;
      case 'Medico':
        return <MedicoDashboard />;
      case 'Empleado':
        return <EmpleadoDashboard />;
      case 'Paciente':
        return <PacienteDashboard />;
      default:
        return (
          <div className="dashboard-error">
            <h2>Rol No Reconocido</h2>
            <p>El rol del usuario no es válido.</p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-welcome">
        <h1>
          <i className="fas fa-chart-line"></i>
          Bienvenido, {user.nombre} {user.apellido}
        </h1>
        <p className="user-role">
          <i className="fas fa-user-tag"></i>
          {user.rol}
        </p>
      </div>
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
