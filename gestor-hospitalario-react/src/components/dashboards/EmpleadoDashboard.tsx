import React, { useState, useEffect } from 'react';
import { useConsultas, useMedicos } from '../../hooks';

interface EmpleadoStats {
  citasHoy: number;
  citasSemana: number;
  medicosDisponibles: number;
  salasOcupadas: number;
}

export const EmpleadoDashboard: React.FC = () => {
  const { consultas } = useConsultas();
  const { medicos } = useMedicos();
  
  const [stats, setStats] = useState<EmpleadoStats>({
    citasHoy: 0,
    citasSemana: 0,
    medicosDisponibles: 0,
    salasOcupadas: 0
  });

  useEffect(() => {
    const hoy = new Date().toDateString();
    const citasHoy = consultas.filter(c => 
      new Date(c.fechaConsulta).toDateString() === hoy
    ).length;

    setStats({
      citasHoy,
      citasSemana: consultas.length,
      medicosDisponibles: medicos.length,
      salasOcupadas: Math.floor(Math.random() * 5) + 1 // Simulado
    });
  }, [consultas, medicos]);

  return (
    <div className="empleado-dashboard">
      <div className="dashboard-grid">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.citasHoy}</h3>
              <p>Citas Hoy</p>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <i className="fas fa-calendar-week"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.citasSemana}</h3>
              <p>Citas Esta Semana</p>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">
              <i className="fas fa-user-md"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.medicosDisponibles}</h3>
              <p>Médicos Disponibles</p>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <i className="fas fa-door-open"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.salasOcupadas}/8</h3>
              <p>Salas Ocupadas</p>
            </div>
          </div>
        </div>

        {/* Citas del Día */}
        <div className="appointments-today">
          <h3>
            <i className="fas fa-list-ul"></i>
            Citas del Día
          </h3>
          <div className="appointment-list">
            <div className="appointment-item">
              <div className="appointment-time">09:00</div>
              <div className="appointment-content">
                <p><strong>Dr. García</strong> - Juan Pérez</p>
                <span className="appointment-type">Consulta General</span>
                <span className="appointment-status confirmed">Confirmada</span>
              </div>
            </div>
            <div className="appointment-item">
              <div className="appointment-time">10:30</div>
              <div className="appointment-content">
                <p><strong>Dra. López</strong> - María García</p>
                <span className="appointment-type">Cardiología</span>
                <span className="appointment-status pending">Pendiente</span>
              </div>
            </div>
            <div className="appointment-item">
              <div className="appointment-time">11:00</div>
              <div className="appointment-content">
                <p><strong>Dr. Martínez</strong> - Carlos López</p>
                <span className="appointment-type">Dermatología</span>
                <span className="appointment-status confirmed">Confirmada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="quick-actions">
          <h3>
            <i className="fas fa-tasks"></i>
            Tareas Administrativas
          </h3>
          <div className="action-grid">
            <button className="action-btn primary">
              <i className="fas fa-calendar-plus"></i>
              Programar Cita
            </button>
            <button className="action-btn success">
              <i className="fas fa-user-plus"></i>
              Registrar Paciente
            </button>
            <button className="action-btn info">
              <i className="fas fa-file-alt"></i>
              Generar Reporte
            </button>
            <button className="action-btn warning">
              <i className="fas fa-phone"></i>
              Llamadas Pendientes
            </button>
          </div>
        </div>

        {/* Estado de Médicos */}
        <div className="doctor-status">
          <h3>
            <i className="fas fa-user-md"></i>
            Estado de Médicos
          </h3>
          <div className="doctor-list">
            <div className="doctor-item">
              <div className="doctor-info">
                <h4>Dr. García</h4>
                <p>Medicina General</p>
              </div>
              <div className="doctor-status available">
                <i className="fas fa-circle"></i>
                Disponible
              </div>
            </div>
            <div className="doctor-item">
              <div className="doctor-info">
                <h4>Dra. López</h4>
                <p>Cardiología</p>
              </div>
              <div className="doctor-status busy">
                <i className="fas fa-circle"></i>
                Ocupado
              </div>
            </div>
            <div className="doctor-item">
              <div className="doctor-info">
                <h4>Dr. Martínez</h4>
                <p>Dermatología</p>
              </div>
              <div className="doctor-status available">
                <i className="fas fa-circle"></i>
                Disponible
              </div>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="notifications">
          <h3>
            <i className="fas fa-bell"></i>
            Notificaciones
          </h3>
          <div className="notification-list">
            <div className="notification-item urgent">
              <i className="fas fa-exclamation-triangle"></i>
              <p>Cita cancelada - Dr. García 14:00</p>
              <span className="notification-time">Hace 5 min</span>
            </div>
            <div className="notification-item info">
              <i className="fas fa-info-circle"></i>
              <p>Nuevo paciente registrado</p>
              <span className="notification-time">Hace 15 min</span>
            </div>
            <div className="notification-item warning">
              <i className="fas fa-clock"></i>
              <p>Recordatorio: Llamar a paciente</p>
              <span className="notification-time">Hace 30 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
