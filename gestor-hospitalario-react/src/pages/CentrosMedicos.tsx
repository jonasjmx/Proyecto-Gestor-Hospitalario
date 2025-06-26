import React, { useState } from 'react';
import { Header, Navigation, DataTable, Modal, SearchBox } from '../components';
import { useCentrosMedicos } from '../hooks';
import type { CentroMedico, CentroMedicoCreate, TableColumn } from '../@types';

const CentrosMedicos: React.FC = () => {
  const {
    centrosMedicos,
    loading,
    createCentroMedico,
    updateCentroMedico,
    deleteCentroMedico
  } = useCentrosMedicos();

  const { validateCentroMedico } = useCentrosMedicos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCentro, setCurrentCentro] = useState<CentroMedico | null>(null);
  const [formData, setFormData] = useState<CentroMedicoCreate>({
    nombre: '',
    direccion: '',
    telefono: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar centros médicos por búsqueda
  const filteredCentros = centrosMedicos.filter(centro =>
    centro.nombre.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    centro.direccion.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    centro.email.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  // Configuración de columnas para la tabla
  const columns: TableColumn[] = [
    { key: 'centroID', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'direccion', label: 'Dirección' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' }
  ];

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentCentro(null);
    setFormData({
      nombre: '',
      direccion: '',
      telefono: '',
      email: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (centro: CentroMedico) => {
    setIsEditing(true);
    setCurrentCentro(centro);
    setFormData({
      nombre: centro.nombre,
      direccion: centro.direccion,
      telefono: centro.telefono,
      email: centro.email
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCentro(null);
    setFormData({
      nombre: '',
      direccion: '',
      telefono: '',
      email: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateCentroMedico(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    let success = false;
    if (isEditing && currentCentro) {
      success = await updateCentroMedico(currentCentro.centroID, {
        ...formData,
        centroID: currentCentro.centroID
      });
    } else {
      success = await createCentroMedico(formData);
    }
    if (success) {
      closeModal();
    }
  };

  const handleDelete = async (centro: CentroMedico) => {
    if (window.confirm(`¿Está seguro de que desea eliminar el centro médico "${centro.nombre}"?`)) {
      await deleteCentroMedico(centro.centroID);
    }
  };

  return (
    <div className="page-container">
      <Header />
      <Navigation />
      
      <main className="main-content">
        <div className="container">
          <div className="table-header">
            <h2 className="table-title">Centros Médicos</h2>
            <button onClick={openCreateModal} className="btn btn-primary">
              <i className="fas fa-plus"></i>
              Agregar Nuevo
            </button>
          </div>

          <SearchBox
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar centros médicos..."
          />

          <DataTable
            data={filteredCentros}
            columns={columns}
            onEdit={openEditModal}
            onDelete={handleDelete}
            loading={loading}
            emptyMessage="No se encontraron centros médicos"
          />
        </div>
      </main>

      {/* Modal para crear/editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? 'Editar Centro Médico' : 'Crear Centro Médico'}
      >
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="modal-form-label">Nombre <span className="required">*</span></label>
            <input
              type="text"
              className={`modal-form-input${formErrors.nombre ? ' error' : ''}`}
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
            {formErrors.nombre && <div className="modal-form-error">{formErrors.nombre}</div>}
          </div>
          <div className="form-group">
            <label className="modal-form-label">Dirección <span className="required">*</span></label>
            <input
              type="text"
              className={`modal-form-input${formErrors.direccion ? ' error' : ''}`}
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              required
            />
            {formErrors.direccion && <div className="modal-form-error">{formErrors.direccion}</div>}
          </div>
          <div className="form-group">
            <label className="modal-form-label">Teléfono <span className="required">*</span></label>
            <input
              type="tel"
              className={`modal-form-input${formErrors.telefono ? ' error' : ''}`}
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              required
            />
            {formErrors.telefono && <div className="modal-form-error">{formErrors.telefono}</div>}
          </div>
          <div className="form-group">
            <label className="modal-form-label">Email <span className="required">*</span></label>
            <input
              type="email"
              className={`modal-form-input${formErrors.email ? ' error' : ''}`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            {formErrors.email && <div className="modal-form-error">{formErrors.email}</div>}
          </div>
          <div className="modal-actions">
            <button type="button" onClick={closeModal} className="modal-btn cancel">
              Cancelar
            </button>
            <button type="submit" className="modal-btn" disabled={loading}>
              {loading ? 'Procesando...' : (isEditing ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CentrosMedicos;
