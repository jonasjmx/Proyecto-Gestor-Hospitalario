import React, { useState, useEffect } from 'react';
import { useCentrosMedicos, useMedicos, useEmpleados } from '../../hooks';

interface DashboardStats {
  totalCentros: number;
  totalMedicos: number;
  totalEmpleados: number;
  totalPacientes: number;
}

export const AdminDashboard: React.FC = () => {
  const { centrosMedicos } = useCentrosMedicos();
  const { medicos } = useMedicos();
  const { empleados } = useEmpleados();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalCentros: 0,
    totalMedicos: 0,
    totalEmpleados: 0,
    totalPacientes: 0
  });

  useEffect(() => {
    setStats({
      totalCentros: centrosMedicos.length,
      totalMedicos: medicos.length,
      totalEmpleados: empleados.length,
      totalPacientes: 0 // TODO: Implementar cuando tengamos el hook de pacientes
    });
  }, [centrosMedicos, medicos, empleados]);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-grid">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <i className="fas fa-hospital"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalCentros}</h3>
              <p>Centros Médicos</p>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <i className="fas fa-user-md"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalMedicos}</h3>
              <p>Médicos</p>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalEmpleados}</h3>
              <p>Empleados</p>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <i className="fas fa-user-injured"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalPacientes}</h3>
              <p>Pacientes</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>
            <i className="fas fa-bolt"></i>
            Acciones Rápidas
          </h3>
          <div className="action-grid">
            <button className="action-btn primary">
              <i className="fas fa-plus"></i>
              Nuevo Centro Médico
            </button>
            <button className="action-btn success">
              <i className="fas fa-user-plus"></i>
              Nuevo Médico
            </button>
            <button className="action-btn info">
              <i className="fas fa-users"></i>
              Nuevo Empleado
            </button>
            <button className="action-btn warning">
              <i className="fas fa-chart-bar"></i>
              Ver Reportes
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h3>
            <i className="fas fa-clock"></i>
            Actividad Reciente
          </h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon success">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="activity-content">
                <p>Nuevo médico registrado</p>
                <span className="activity-time">Hace 2 horas</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon primary">
                <i className="fas fa-hospital"></i>
              </div>
              <div className="activity-content">
                <p>Centro médico actualizado</p>
                <span className="activity-time">Hace 4 horas</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon info">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="activity-content">
                <p>Nueva consulta programada</p>
                <span className="activity-time">Hace 6 horas</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="system-health">
          <h3>
            <i className="fas fa-heartbeat"></i>
            Estado del Sistema
          </h3>
          <div className="health-metrics">
            <div className="metric">
              <div className="metric-label">Base de Datos</div>
              <div className="metric-status online">
                <i className="fas fa-check-circle"></i>
                Online
              </div>
            </div>
            <div className="metric">
              <div className="metric-label">API Server</div>
              <div className="metric-status online">
                <i className="fas fa-check-circle"></i>
                Online
              </div>
            </div>
            <div className="metric">
              <div className="metric-label">Backup</div>
              <div className="metric-status warning">
                <i className="fas fa-exclamation-triangle"></i>
                Pendiente
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
