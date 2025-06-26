import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Header, Navigation, DataTable, Modal, SearchBox, SelectModal } from '../components';
import { useConsultas, useMedicos, usePacientes } from '../hooks';
import type { Consulta, ConsultaCreate, TableColumn } from '../@types';

const Consultas: React.FC = () => {
  const {
    consultas,
    loading,
    error,
    createConsulta,
    updateConsulta,
    deleteConsulta
  } = useConsultas();
  const { medicos } = useMedicos();
  const { pacientes } = usePacientes();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentConsulta, setCurrentConsulta] = useState<Consulta | null>(null);
  const [formData, setFormData] = useState<ConsultaCreate>({
    pacienteID: 0,
    medicoID: 0,
    fechaConsulta: '',
    motivoConsulta: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
    estado: 'Programada'
  });
  const [selectMedicoModal, setSelectMedicoModal] = useState(false);
  const [selectPacienteModal, setSelectPacienteModal] = useState(false);

  // Filtrar consultas por búsqueda
  const filteredConsultas = consultas.filter(consulta =>
    consulta.motivoConsulta.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consulta.diagnostico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consulta.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Configuración de columnas para la tabla
  const columns: TableColumn[] = [
    { key: 'consultaID', label: 'ID' },
    { key: 'pacienteID', label: 'Paciente ID' },
    { key: 'medicoID', label: 'Médico ID' },
    { key: 'fechaConsulta', label: 'Fecha' },
    { key: 'motivoConsulta', label: 'Motivo' },
    { key: 'diagnostico', label: 'Diagnóstico' },
    { key: 'estado', label: 'Estado' }
  ];

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentConsulta(null);
    setFormData({
      pacienteID: 0,
      medicoID: 0,
      fechaConsulta: '',
      motivoConsulta: '',
      diagnostico: '',
      tratamiento: '',
      observaciones: '',
      estado: 'Programada'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (consulta: Consulta) => {
    setIsEditing(true);
    setCurrentConsulta(consulta);
    setFormData({
      pacienteID: consulta.pacienteID,
      medicoID: consulta.medicoID,
      fechaConsulta: consulta.fechaConsulta.split('T')[0], // Formato para input date
      motivoConsulta: consulta.motivoConsulta,
      diagnostico: consulta.diagnostico,
      tratamiento: consulta.tratamiento,
      observaciones: consulta.observaciones,
      estado: consulta.estado
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentConsulta(null);
    setFormData({
      pacienteID: 0,
      medicoID: 0,
      fechaConsulta: '',
      motivoConsulta: '',
      diagnostico: '',
      tratamiento: '',
      observaciones: '',
      estado: 'Programada'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;
    
    if (isEditing && currentConsulta) {
      success = await updateConsulta(currentConsulta.consultaID, {
        ...formData,
        consultaID: currentConsulta.consultaID
      });
    } else {
      success = await createConsulta(formData);
    }

    if (success) {
      toast.success(isEditing ? 'Consulta actualizada exitosamente' : 'Consulta creada exitosamente');
      closeModal();
    } else {
      toast.error(error || 'Error al procesar la solicitud');
    }
  };

  const handleDelete = async (consulta: Consulta) => {
    if (window.confirm(`¿Está seguro de que desea eliminar la consulta #${consulta.consultaID}?`)) {
      const success = await deleteConsulta(consulta.consultaID);
      if (success) {
        toast.success('Consulta eliminada exitosamente');
      } else {
        toast.error(error || 'Error al eliminar la consulta');
      }
    }
  };

  return (
    <div className="page-container">
      <Header />
      <Navigation />
      
      <main className="main-content">
        <div className="container">
          <div className="table-header">
            <h2 className="table-title">Consultas Médicas</h2>
            <button onClick={openCreateModal} className="btn btn-primary">
              <i className="fas fa-plus"></i>
              Agregar Nueva
            </button>
          </div>

          <SearchBox
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar consultas..."
          />

          <DataTable
            data={filteredConsultas}
            columns={columns}
            onEdit={openEditModal}
            onDelete={handleDelete}
            loading={loading}
            emptyMessage="No se encontraron consultas"
          />
        </div>
      </main>

      {/* Modal para crear/editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? 'Editar Consulta' : 'Crear Consulta'}
        size="large"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Paciente *</label>
              <button
                type="button"
                className="modal-btn"
                onClick={() => setSelectPacienteModal(true)}
                style={{ width: '100%', marginBottom: 8 }}
              >
                {formData.pacienteID
                  ? pacientes.find(p => p.pacienteID === formData.pacienteID)?.nombre || 'Seleccionar paciente'
                  : 'Seleccionar paciente'}
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">Médico *</label>
              <button
                type="button"
                className="modal-btn"
                onClick={() => setSelectMedicoModal(true)}
                style={{ width: '100%', marginBottom: 8 }}
              >
                {formData.medicoID
                  ? medicos.find(m => m.medicoID === formData.medicoID)?.nombre || 'Seleccionar médico'
                  : 'Seleccionar médico'}
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fecha de Consulta *</label>
              <input
                type="date"
                className="form-input"
                value={formData.fechaConsulta}
                onChange={(e) => setFormData({ ...formData, fechaConsulta: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Estado *</label>
              <select
                className="form-select"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                required
              >
                <option value="Programada">Programada</option>
                <option value="En Curso">En Curso</option>
                <option value="Completada">Completada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Motivo de Consulta *</label>
            <textarea
              className="form-textarea"
              value={formData.motivoConsulta}
              onChange={(e) => setFormData({ ...formData, motivoConsulta: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Diagnóstico</label>
            <textarea
              className="form-textarea"
              value={formData.diagnostico}
              onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tratamiento</label>
            <textarea
              className="form-textarea"
              value={formData.tratamiento}
              onChange={(e) => setFormData({ ...formData, tratamiento: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Observaciones</label>
            <textarea
              className="form-textarea"
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={closeModal} className="btn btn-outline">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Procesando...' : (isEditing ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de selección de paciente */}
      <SelectModal
        isOpen={selectPacienteModal}
        onClose={() => setSelectPacienteModal(false)}
        options={pacientes.map(p => ({ id: p.pacienteID, label: p.nombre }))}
        onSelect={opt => setFormData({ ...formData, pacienteID: opt.id })}
        title="Seleccionar Paciente"
      />

      {/* Modal de selección de médico */}
      <SelectModal
        isOpen={selectMedicoModal}
        onClose={() => setSelectMedicoModal(false)}
        options={medicos.map(m => ({ id: m.medicoID, label: m.nombre }))}
        onSelect={opt => setFormData({ ...formData, medicoID: opt.id })}
        title="Seleccionar Médico"
      />
    </div>
  );
};

export default Consultas;
