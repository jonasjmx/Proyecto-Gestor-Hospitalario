import { useState, useEffect } from 'react';
import { medicoService } from '../services';
import type { Medico, MedicoCreate, MedicoUpdate } from '../@types';
import toast from 'react-hot-toast';

export const useMedicos = () => {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [allMedicos, setAllMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar médicos basado en el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setMedicos(allMedicos);
    } else {
      const filtered = allMedicos.filter(medico =>
        medico.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medico.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medico.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medico.telefono.includes(searchTerm) ||
        medico.especialidadID.toString().includes(searchTerm)
      );
      setMedicos(filtered);
    }
  }, [allMedicos, searchTerm]);

  const fetchMedicos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await medicoService.getAll();
      setAllMedicos(data);
      setMedicos(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar médicos';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createMedico = async (medico: MedicoCreate): Promise<boolean> => {
    const createPromise = async () => {
      const newMedico = await medicoService.create(medico);
      setAllMedicos(prev => [...prev, newMedico]);
      return newMedico;
    };

    try {
      await toast.promise(
        createPromise(),
        {
          loading: 'Creando médico...',
          success: 'Médico creado exitosamente',
          error: 'Error al crear médico'
        }
      );
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear médico';
      setError(errorMessage);
      return false;
    }
  };

  const updateMedico = async (id: number, medico: MedicoUpdate): Promise<boolean> => {
    const updatePromise = async () => {
      const updatedMedico = await medicoService.update(id, medico);
      setAllMedicos(prev => 
        prev.map(med => med.medicoID === id ? updatedMedico : med)
      );
      return updatedMedico;
    };

    try {
      await toast.promise(
        updatePromise(),
        {
          loading: 'Actualizando médico...',
          success: 'Médico actualizado exitosamente',
          error: 'Error al actualizar médico'
        }
      );
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar médico';
      setError(errorMessage);
      return false;
    }
  };

  const deleteMedico = async (id: number): Promise<boolean> => {
    const deletePromise = async () => {
      await medicoService.delete(id);
      setAllMedicos(prev => prev.filter(med => med.medicoID !== id));
    };

    try {
      await toast.promise(
        deletePromise(),
        {
          loading: 'Eliminando médico...',
          success: 'Médico eliminado exitosamente',
          error: 'Error al eliminar médico'
        }
      );
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar médico';
      setError(errorMessage);
      return false;
    }
  };

  // Validaciones para crear/editar médico
  const validateMedico = (values: MedicoCreate | MedicoUpdate) => {
    const errors: Record<string, string> = {};
    if (!values.nombre || values.nombre.trim() === '') {
      errors.nombre = 'El nombre es obligatorio';
    } else if (values.nombre.length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    if (!values.apellido || values.apellido.trim() === '') {
      errors.apellido = 'El apellido es obligatorio';
    } else if (values.apellido.length < 3) {
      errors.apellido = 'El apellido debe tener al menos 3 caracteres';
    }
    if (!values.cedula || values.cedula.trim() === '') {
      errors.cedula = 'La cédula es obligatoria';
    } else if (!/^[0-9]{10,13}$/.test(values.cedula)) {
      errors.cedula = 'La cédula debe tener entre 10 y 13 dígitos';
    }
    if (!values.telefono || values.telefono.trim() === '') {
      errors.telefono = 'El teléfono es obligatorio';
    } else if (!/^[0-9]{7,15}$/.test(values.telefono)) {
      errors.telefono = 'El teléfono debe ser numérico y válido';
    }
    if (!values.email || values.email.trim() === '') {
      errors.email = 'El email es obligatorio';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.email)) {
      errors.email = 'El email no es válido';
    }
    if (!values.numeroLicencia || values.numeroLicencia.trim() === '') {
      errors.numeroLicencia = 'El número de licencia es obligatorio';
    }
    if (!values.especialidadID || values.especialidadID <= 0) {
      errors.especialidadID = 'Debe seleccionar una especialidad';
    }
    if (!values.centroMedicoID || values.centroMedicoID <= 0) {
      errors.centroMedicoID = 'Debe seleccionar un centro médico';
    }
    return errors;
  };

  const clearError = () => setError(null);
  
  const refresh = () => fetchMedicos();

  useEffect(() => {
    fetchMedicos();
  }, []);

  return {
    medicos,
    allMedicos,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    createMedico,
    updateMedico,
    deleteMedico,
    validateMedico, // <-- exportar validador
    clearError,
    refresh,
    filteredTotal: medicos.length,
    totalCount: allMedicos.length
  };
};
