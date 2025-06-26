import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Header, Navigation, DataTable, Modal, SearchBox, SelectModal } from '../components';
import { useEmpleados } from '../hooks/useEmpleados';
import { useCentrosMedicos } from '../hooks/useCentrosMedicos';
import type { Empleado, EmpleadoCreate, TableColumn } from '../@types';

const Empleados: React.FC = () => {
  const {
    empleados,
    loading,
    error,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    validateEmpleado
  } = useEmpleados();
  const { centrosMedicos } = useCentrosMedicos();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmpleado, setCurrentEmpleado] = useState<Empleado | null>(null);
  const [formData, setFormData] = useState<EmpleadoCreate>({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    email: '',
    cargo: '',
    fechaIngreso: '',
    salario: 0,
    centroMedicoID: 0
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectCentroModal, setSelectCentroModal] = useState(false);

  // Filtrar empleados por búsqueda
  const filteredEmpleados = empleados.filter(empleado =>
    empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.cedula.includes(searchTerm) ||
    empleado.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Configuración de columnas para la tabla
  const columns: TableColumn[] = [
    { key: 'empleadoID', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'cargo', label: 'Cargo' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    { key: 'salario', label: 'Salario' }
  ];

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentEmpleado(null);
    setFormData({
      nombre: '',
      apellido: '',
      cedula: '',
      telefono: '',
      email: '',
      cargo: '',
      fechaIngreso: '',
      salario: 0,
      centroMedicoID: 0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (empleado: Empleado) => {
    setIsEditing(true);
    setCurrentEmpleado(empleado);
    setFormData({
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      cedula: empleado.cedula,
      telefono: empleado.telefono,
      email: empleado.email,
      cargo: empleado.cargo,
      fechaIngreso: empleado.fechaIngreso.split('T')[0],
      salario: empleado.salario,
      centroMedicoID: empleado.centroMedicoID
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEmpleado(null);
    setFormData({
      nombre: '',
      apellido: '',
      cedula: '',
      telefono: '',
      email: '',
      cargo: '',
      fechaIngreso: '',
      salario: 0,
      centroMedicoID: 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateEmpleado(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    let success = false;
    if (isEditing && currentEmpleado) {
      success = await updateEmpleado(currentEmpleado.empleadoID, {
        ...formData,
        empleadoID: currentEmpleado.empleadoID
      });
    } else {
      success = await createEmpleado(formData);
    }
    if (success) {
      toast.success(isEditing ? 'Empleado actualizado exitosamente' : 'Empleado creado exitosamente');
      closeModal();
    } else {
      toast.error(error || 'Error al procesar la solicitud');
    }
  };

  const handleDelete = async (empleado: Empleado) => {
    if (window.confirm(`¿Está seguro de que desea eliminar al empleado "${empleado.nombre} ${empleado.apellido}"?`)) {
      const success = await deleteEmpleado(empleado.empleadoID);
      if (success) {
        toast.success('Empleado eliminado exitosamente');
      } else {
        toast.error(error || 'Error al eliminar el empleado');
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
            <h2 className="table-title">Empleados</h2>
            <button onClick={openCreateModal} className="btn btn-primary">
              <i className="fas fa-plus"></i>
              Agregar Nuevo
            </button>
          </div>

          <SearchBox
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar empleados..."
          />

          <DataTable
            data={filteredEmpleados}
            columns={columns}
            onEdit={openEditModal}
            onDelete={handleDelete}
            loading={loading}
            emptyMessage="No se encontraron empleados"
          />
        </div>
      </main>

      {/* Modal para crear/editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? 'Editar Empleado' : 'Crear Empleado'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
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
              <label className="modal-form-label">Apellido <span className="required">*</span></label>
              <input
                type="text"
                className={`modal-form-input${formErrors.apellido ? ' error' : ''}`}
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                required
              />
              {formErrors.apellido && <div className="modal-form-error">{formErrors.apellido}</div>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="modal-form-label">Cédula <span className="required">*</span></label>
              <input
                type="text"
                className={`modal-form-input${formErrors.cedula ? ' error' : ''}`}
                value={formData.cedula}
                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                required
              />
              {formErrors.cedula && <div className="modal-form-error">{formErrors.cedula}</div>}
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
          </div>
          <div className="form-row">
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
            <div className="form-group">
              <label className="modal-form-label">Cargo <span className="required">*</span></label>
              <input
                type="text"
                className={`modal-form-input${formErrors.cargo ? ' error' : ''}`}
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                required
              />
              {formErrors.cargo && <div className="modal-form-error">{formErrors.cargo}</div>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="modal-form-label">Fecha de Ingreso <span className="required">*</span></label>
              <input
                type="date"
                className={`modal-form-input${formErrors.fechaIngreso ? ' error' : ''}`}
                value={formData.fechaIngreso}
                onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
                required
              />
              {formErrors.fechaIngreso && <div className="modal-form-error">{formErrors.fechaIngreso}</div>}
            </div>
            <div className="form-group">
              <label className="modal-form-label">Salario <span className="required">*</span></label>
              <input
                type="number"
                className={`modal-form-input${formErrors.salario ? ' error' : ''}`}
                value={formData.salario}
                onChange={(e) => setFormData({ ...formData, salario: Number(e.target.value) })}
                required
                min={0}
              />
              {formErrors.salario && <div className="modal-form-error">{formErrors.salario}</div>}
            </div>
          </div>
          <div className="form-group">
            <label className="modal-form-label">Centro Médico <span className="required">*</span></label>
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
            {formErrors.centroMedicoID && <div className="modal-form-error">{formErrors.centroMedicoID}</div>}
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
        <SelectModal
          isOpen={selectCentroModal}
          onClose={() => setSelectCentroModal(false)}
          options={centrosMedicos.map(c => ({ id: c.centroID, label: c.nombre }))}
          onSelect={(opt: { id: number }) => setFormData({ ...formData, centroMedicoID: opt.id })}
          title="Seleccionar Centro Médico"
        />
      </Modal>
    </div>
  );
};

export default Empleados;
