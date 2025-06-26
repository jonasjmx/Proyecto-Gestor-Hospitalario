import React, { useState, useEffect } from 'react';
import { useConsultas } from '../../hooks';

interface MedicoStats {
  consultasHoy: number;
  consultasSemana: number;
  pacientesAtendidos: number;
  proximaCita: string | null;
}

export const MedicoDashboard: React.FC = () => {
  const { consultas } = useConsultas();
  
  const [stats, setStats] = useState<MedicoStats>({
    consultasHoy: 0,
    consultasSemana: 0,
    pacientesAtendidos: 0,
    proximaCita: null
  });

  useEffect(() => {
    // TODO: Calcular estadísticas basadas en las consultas del médico actual
    const hoy = new Date().toDateString();
    const consultasHoy = consultas.filter(c => 
      new Date(c.fechaConsulta).toDateString() === hoy
    ).length;

    setStats({
      consultasHoy,
      consultasSemana: consultas.length,
      pacientesAtendidos: new Set(consultas.map(c => c.pacienteID)).size,
      proximaCita: consultas.length > 0 ? consultas[0].fechaConsulta : null
    });
  }, [consultas]);

  return (
    <div className="medico-dashboard">
      <div className="dashboard-grid">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <i className="fas fa-calendar-day"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.consultasHoy}</h3>
              <p>Consultas Hoy</p>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <i className="fas fa-calendar-week"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.consultasSemana}</h3>
              <p>Consultas Esta Semana</p>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">
              <i className="fas fa-user-injured"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.pacientesAtendidos}</h3>
              <p>Pacientes Atendidos</p>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.proximaCita ? 'Programada' : 'Sin citas'}</h3>
              <p>Próxima Cita</p>
            </div>
          </div>
        </div>

        {/* Horario del Día */}
        <div className="schedule-today">
          <h3>
            <i className="fas fa-calendar-alt"></i>
            Horario de Hoy
          </h3>
          <div className="schedule-list">
            <div className="schedule-item">
              <div className="schedule-time">09:00</div>
              <div className="schedule-content">
                <p>Juan Pérez - Consulta General</p>
                <span className="schedule-status confirmed">Confirmada</span>
              </div>
            </div>
            <div className="schedule-item">
              <div className="schedule-time">10:30</div>
              <div className="schedule-content">
                <p>María García - Control Rutinario</p>
                <span className="schedule-status pending">Pendiente</span>
              </div>
            </div>
            <div className="schedule-item">
              <div className="schedule-time">11:00</div>
              <div className="schedule-content">
                <p>Carlos López - Seguimiento</p>
                <span className="schedule-status confirmed">Confirmada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="quick-actions">
          <h3>
            <i className="fas fa-stethoscope"></i>
            Acciones Médicas
          </h3>
          <div className="action-grid">
            <button className="action-btn primary">
              <i className="fas fa-notes-medical"></i>
              Nueva Consulta
            </button>
            <button className="action-btn success">
              <i className="fas fa-prescription-bottle-alt"></i>
              Recetar Medicamento
            </button>
            <button className="action-btn info">
              <i className="fas fa-file-medical"></i>
              Ver Historiales
            </button>
            <button className="action-btn warning">
              <i className="fas fa-calendar-plus"></i>
              Programar Cita
            </button>
          </div>
        </div>

        {/* Pacientes Recientes */}
        <div className="recent-patients">
          <h3>
            <i className="fas fa-users"></i>
            Pacientes Recientes
          </h3>
          <div className="patient-list">
            <div className="patient-item">
              <div className="patient-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="patient-info">
                <h4>Ana Rodríguez</h4>
                <p>Última consulta: 15/06/2025</p>
                <span className="patient-condition">Hipertensión</span>
              </div>
            </div>
            <div className="patient-item">
              <div className="patient-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="patient-info">
                <h4>Pedro Martínez</h4>
                <p>Última consulta: 14/06/2025</p>
                <span className="patient-condition">Diabetes</span>
              </div>
            </div>
            <div className="patient-item">
              <div className="patient-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="patient-info">
                <h4>Lucía Fernández</h4>
                <p>Última consulta: 13/06/2025</p>
                <span className="patient-condition">Control Rutinario</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
