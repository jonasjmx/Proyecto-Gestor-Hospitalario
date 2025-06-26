import React, { useState, useEffect } from 'react';
import { useConsultas } from '../../hooks';

interface PacienteStats {
  proximaCita: string | null;
  consultasRealizadas: number;
  medicamentosActivos: number;
  ultimaConsulta: string | null;
}

export const PacienteDashboard: React.FC = () => {
  const { consultas } = useConsultas();
  
  const [stats, setStats] = useState<PacienteStats>({
    proximaCita: null,
    consultasRealizadas: 0,
    medicamentosActivos: 0,
    ultimaConsulta: null
  });

  useEffect(() => {
    // TODO: Filtrar consultas por paciente actual
    const consultasPaciente = consultas; // Filtrar por paciente actual cuando esté implementado
    
    setStats({
      proximaCita: consultasPaciente.length > 0 ? consultasPaciente[0].fechaConsulta : null,
      consultasRealizadas: consultasPaciente.length,
      medicamentosActivos: 2, // Simulado
      ultimaConsulta: consultasPaciente.length > 0 ? consultasPaciente[consultasPaciente.length - 1].fechaConsulta : null
    });
  }, [consultas]);

  return (
    <div className="paciente-dashboard">
      <div className="dashboard-grid">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <i className="fas fa-calendar-plus"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.proximaCita ? 'Programada' : 'Sin citas'}</h3>
              <p>Próxima Cita</p>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <i className="fas fa-file-medical"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.consultasRealizadas}</h3>
              <p>Consultas Realizadas</p>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">
              <i className="fas fa-pills"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.medicamentosActivos}</h3>
              <p>Medicamentos Activos</p>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.ultimaConsulta ? 'Reciente' : 'Sin historial'}</h3>
              <p>Última Consulta</p>
            </div>
          </div>
        </div>

        {/* Próximas Citas */}
        <div className="upcoming-appointments">
          <h3>
            <i className="fas fa-calendar-alt"></i>
            Próximas Citas
          </h3>
          <div className="appointment-list">
            <div className="appointment-item">
              <div className="appointment-date">
                <div className="day">15</div>
                <div className="month">JUL</div>
              </div>
              <div className="appointment-content">
                <h4>Control Rutinario</h4>
                <p><strong>Dr. García</strong> - Medicina General</p>
                <span className="appointment-time">10:00 AM</span>
              </div>
              <div className="appointment-status confirmed">
                <i className="fas fa-check-circle"></i>
              </div>
            </div>
            <div className="appointment-item">
              <div className="appointment-date">
                <div className="day">22</div>
                <div className="month">JUL</div>
              </div>
              <div className="appointment-content">
                <h4>Cardiología</h4>
                <p><strong>Dra. López</strong> - Especialista</p>
                <span className="appointment-time">14:30 PM</span>
              </div>
              <div className="appointment-status pending">
                <i className="fas fa-clock"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="quick-actions">
          <h3>
            <i className="fas fa-hand-holding-medical"></i>
            Servicios Disponibles
          </h3>
          <div className="action-grid">
            <button className="action-btn primary">
              <i className="fas fa-calendar-plus"></i>
              Solicitar Cita
            </button>
            <button className="action-btn success">
              <i className="fas fa-file-download"></i>
              Descargar Historial
            </button>
            <button className="action-btn info">
              <i className="fas fa-prescription-bottle-alt"></i>
              Ver Recetas
            </button>
            <button className="action-btn warning">
              <i className="fas fa-phone"></i>
              Contactar Centro
            </button>
          </div>
        </div>

        {/* Historial Médico Reciente */}
        <div className="medical-history">
          <h3>
            <i className="fas fa-notes-medical"></i>
            Historial Reciente
          </h3>
          <div className="history-list">
            <div className="history-item">
              <div className="history-date">20/06/2025</div>
              <div className="history-content">
                <h4>Control General</h4>
                <p><strong>Dr. García</strong></p>
                <p>Examen de rutina, presión arterial normal</p>
                <span className="history-diagnosis">Estado: Normal</span>
              </div>
            </div>
            <div className="history-item">
              <div className="history-date">15/05/2025</div>
              <div className="history-content">
                <h4>Consulta Cardiológica</h4>
                <p><strong>Dra. López</strong></p>
                <p>Electrocardiograma, seguimiento rutinario</p>
                <span className="history-diagnosis">Estado: Controlado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Medicamentos */}
        <div className="medications">
          <h3>
            <i className="fas fa-pills"></i>
            Medicamentos Actuales
          </h3>
          <div className="medication-list">
            <div className="medication-item">
              <div className="medication-info">
                <h4>Aspirina 100mg</h4>
                <p>1 tableta diaria - Después del desayuno</p>
                <span className="medication-duration">30 días restantes</span>
              </div>
              <div className="medication-status active">
                <i className="fas fa-check-circle"></i>
                Activo
              </div>
            </div>
            <div className="medication-item">
              <div className="medication-info">
                <h4>Losartán 50mg</h4>
                <p>1 tableta cada 12 horas</p>
                <span className="medication-duration">15 días restantes</span>
              </div>
              <div className="medication-status low">
                <i className="fas fa-exclamation-triangle"></i>
                Pocas existencias
              </div>
            </div>
          </div>
        </div>

        {/* Consejos de Salud */}
        <div className="health-tips">
          <h3>
            <i className="fas fa-lightbulb"></i>
            Consejos de Salud
          </h3>
          <div className="tips-list">
            <div className="tip-item">
              <i className="fas fa-dumbbell"></i>
              <p>Realice ejercicio moderado al menos 30 minutos al día</p>
            </div>
            <div className="tip-item">
              <i className="fas fa-apple-alt"></i>
              <p>Mantenga una dieta equilibrada rica en frutas y verduras</p>
            </div>
            <div className="tip-item">
              <i className="fas fa-bed"></i>
              <p>Duerma entre 7-8 horas diarias para una mejor recuperación</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
