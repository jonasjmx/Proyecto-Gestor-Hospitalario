import React, { useState } from 'react';
import { Header, Navigation, DataTable, Modal, SearchBox, SelectModal } from '../components';
import { useMedicos } from '../hooks/useMedicos';
import { useEspecialidades } from '../hooks/useEspecialidades';
import { useCentrosMedicos } from '../hooks/useCentrosMedicos';
import type { Medico, MedicoCreate, TableColumn } from '../@types';
import '../styles/pages.css';

const Medicos: React.FC = () => {
  const {
    medicos,
    loading,
    createMedico,
    updateMedico,
    deleteMedico,
    searchTerm,
    setSearchTerm
  } = useMedicos();
  const { especialidades, fetchEspecialidades } = useEspecialidades();
  const { centrosMedicos, fetchCentrosMedicos } = useCentrosMedicos();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMedico, setCurrentMedico] = useState<Medico | null>(null);
  const [formData, setFormData] = useState<MedicoCreate>({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    email: '',
    especialidadID: 0,
    numeroLicencia: '',
    centroMedicoID: 0
  });
  const [selectEspecialidadModal, setSelectEspecialidadModal] = useState(false);
  const [selectCentroModal, setSelectCentroModal] = useState(false);

  // Configuración de columnas para la tabla
  const columns: TableColumn[] = [
    { key: 'medicoID', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    { key: 'numeroLicencia', label: 'Licencia' },
    { key: 'especialidadID', label: 'Especialidad ID' }
  ];

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentMedico(null);
    setFormData({
      nombre: '',
      apellido: '',
      cedula: '',
      telefono: '',
      email: '',
      especialidadID: 0,
      numeroLicencia: '',
      centroMedicoID: 0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (medico: Medico) => {
    setIsEditing(true);
    setCurrentMedico(medico);
    setFormData({
      nombre: medico.nombre,
      apellido: medico.apellido,
      cedula: medico.cedula,
      telefono: medico.telefono,
      email: medico.email,
      especialidadID: medico.especialidadID,
      numeroLicencia: medico.numeroLicencia,
      centroMedicoID: medico.centroMedicoID
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMedico(null);
    setFormData({
      nombre: '',
      apellido: '',
      cedula: '',
      telefono: '',
      email: '',
      especialidadID: 0,
      numeroLicencia: '',
      centroMedicoID: 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;
    
    if (isEditing && currentMedico) {
      success = await updateMedico(currentMedico.medicoID, {
        ...formData,
        medicoID: currentMedico.medicoID
      });
    } else {
      success = await createMedico(formData);
    }

    if (success) {
      closeModal();
    }
  };

  const handleDelete = async (medico: Medico) => {
    if (window.confirm(`¿Está seguro de que desea eliminar al médico "${medico.nombre} ${medico.apellido}"?`)) {
      await deleteMedico(medico.medicoID);
    }
  };

  return (
    <div className="page-container">
      <Header />
      <Navigation />
      
      <main className="main-content">
        <div className="container">
          <div className="table-header">
            <h2 className="table-title">Médicos</h2>
            <button onClick={openCreateModal} className="btn btn-primary">
              <i className="fas fa-plus"></i>
              Agregar Nuevo
            </button>
          </div>

          <SearchBox
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar médicos..."
          />

          <DataTable
            data={medicos}
            columns={columns}
            onEdit={openEditModal}
            onDelete={handleDelete}
            loading={loading}
            emptyMessage="No se encontraron médicos"
          />
        </div>
      </main>

      {/* Modal para crear/editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? 'Editar Médico' : 'Crear Médico'}
        size="large"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                className="form-input"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Apellido *</label>
              <input
                type="text"
                className="form-input"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cédula *</label>
              <input
                type="text"
                className="form-input"
                value={formData.cedula}
                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Número de Licencia *</label>
              <input
                type="text"
                className="form-input"
                value={formData.numeroLicencia}
                onChange={(e) => setFormData({ ...formData, numeroLicencia: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Teléfono *</label>
              <input
                type="tel"
                className="form-input"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Especialidad *</label>
              <button
                type="button"
                className="modal-btn"
                onClick={() => setSelectEspecialidadModal(true)}
                style={{ width: '100%', marginBottom: 8 }}
              >
                {formData.especialidadID
                  ? especialidades.find(e => e.especialidadID === formData.especialidadID)?.nombre || 'Seleccionar especialidad'
                  : 'Seleccionar especialidad'}
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">Centro Médico *</label>
              <button
                type="button"
                className="modal-btn"
                onClick={() => setSelectCentroModal(true)}
                style={{ width: '100%', marginBottom: 8 }}
              >
                {formData.centroMedicoID
                  ? centrosMedicos.find(c => c.centroID === formData.centroMedicoID)?.nombre || 'Seleccionar centro médico'
                  : 'Seleccionar centro médico'}
              </button>
            </div>
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

      {/* Modal de selección de especialidad */}
      <SelectModal
        isOpen={selectEspecialidadModal}
        onClose={() => setSelectEspecialidadModal(false)}
        options={especialidades.map(e => ({ id: e.especialidadID, label: e.nombre }))}
        onSelect={opt => setFormData({ ...formData, especialidadID: opt.id })}
        title="Seleccionar Especialidad"
      />

      {/* Modal de selección de centro médico */}
      <SelectModal
        isOpen={selectCentroModal}
        onClose={() => setSelectCentroModal(false)}
        options={centrosMedicos.map(c => ({ id: c.centroID, label: c.nombre }))}
        onSelect={opt => setFormData({ ...formData, centroMedicoID: opt.id })}
        title="Seleccionar Centro Médico"
      />
    </div>
  );
};

export default Medicos;
