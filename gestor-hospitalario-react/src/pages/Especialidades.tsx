import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Header, Navigation, DataTable, Modal, SearchBox } from '../components';
import { useEspecialidades } from '../hooks';
import type { Especialidad, EspecialidadCreate, TableColumn } from '../@types';

const Especialidades: React.FC = () => {
  const {
    especialidades,
    loading,
    error,
    createEspecialidad,
    updateEspecialidad,
    deleteEspecialidad
  } = useEspecialidades();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEspecialidad, setCurrentEspecialidad] = useState<Especialidad | null>(null);
  const [formData, setFormData] = useState<EspecialidadCreate>({
    nombre: '',
    descripcion: ''
  });

  // Filtrar especialidades por búsqueda
  const filteredEspecialidades = especialidades.filter(especialidad =>
    especialidad.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    especialidad.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Configuración de columnas para la tabla
  const columns: TableColumn[] = [
    { key: 'especialidadID', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' }
  ];

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentEspecialidad(null);
    setFormData({
      nombre: '',
      descripcion: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (especialidad: Especialidad) => {
    setIsEditing(true);
    setCurrentEspecialidad(especialidad);
    setFormData({
      nombre: especialidad.nombre,
      descripcion: especialidad.descripcion
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEspecialidad(null);
    setFormData({
      nombre: '',
      descripcion: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;
    
    if (isEditing && currentEspecialidad) {
      success = await updateEspecialidad(currentEspecialidad.especialidadID, {
        ...formData,
        especialidadID: currentEspecialidad.especialidadID
      });
    } else {
      success = await createEspecialidad(formData);
    }

    if (success) {
      toast.success(isEditing ? 'Especialidad actualizada exitosamente' : 'Especialidad creada exitosamente');
      closeModal();
    } else {
      toast.error(error || 'Error al procesar la solicitud');
    }
  };

  const handleDelete = async (especialidad: Especialidad) => {
    if (window.confirm(`¿Está seguro de que desea eliminar la especialidad "${especialidad.nombre}"?`)) {
      const success = await deleteEspecialidad(especialidad.especialidadID);
      if (success) {
        toast.success('Especialidad eliminada exitosamente');
      } else {
        toast.error(error || 'Error al eliminar la especialidad');
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
            <h2 className="table-title">Especialidades</h2>
            <button onClick={openCreateModal} className="btn btn-primary">
              <i className="fas fa-plus"></i>
              Agregar Nueva
            </button>
          </div>

          <SearchBox
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar especialidades..."
          />

          <DataTable
            data={filteredEspecialidades}
            columns={columns}
            onEdit={openEditModal}
            onDelete={handleDelete}
            loading={loading}
            emptyMessage="No se encontraron especialidades"
          />
        </div>
      </main>

      {/* Modal para crear/editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? 'Editar Especialidad' : 'Crear Especialidad'}
      >
        <form onSubmit={handleSubmit}>
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
            <label className="form-label">Descripción *</label>
            <textarea
              className="form-textarea"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={4}
              required
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
    </div>
  );
};

export default Especialidades;
