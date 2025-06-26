import { useState, useEffect, useCallback } from 'react';
import { centroMedicoService } from '../services';
import type { CentroMedico, CentroMedicoCreate, CentroMedicoUpdate } from '../@types';
import toast from 'react-hot-toast';

export const useCentrosMedicos = () => {
  const [centrosMedicos, setCentrosMedicos] = useState<CentroMedico[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar centros médicos por término de búsqueda
  const filteredCentros = centrosMedicos.filter(centro =>
    centro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    centro.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    centro.telefono.includes(searchTerm)
  );

  const fetchCentrosMedicos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await centroMedicoService.getAll();
      setCentrosMedicos(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar centros médicos';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCentroMedico = async (centroMedico: CentroMedicoCreate): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const newCentro = await centroMedicoService.create(centroMedico);
      setCentrosMedicos(prev => [...prev, newCentro]);
      toast.success('Centro médico creado exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear centro médico';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCentroMedico = async (id: number, centroMedico: CentroMedicoUpdate): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updatedCentro = await centroMedicoService.update(id, centroMedico);
      setCentrosMedicos(prev => 
        prev.map(centro => centro.centroID === id ? updatedCentro : centro)
      );
      toast.success('Centro médico actualizado exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar centro médico';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCentroMedico = async (id: number): Promise<boolean> => {
    const centro = centrosMedicos.find(c => c.centroID === id);
    if (!centro) return false;

    // Confirmar eliminación
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar el centro médico "${centro.nombre}"?`);
    if (!confirmDelete) return false;

    setLoading(true);
    setError(null);
    try {
      await centroMedicoService.delete(id);
      setCentrosMedicos(prev => prev.filter(centro => centro.centroID !== id));
      toast.success('Centro médico eliminado exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar centro médico';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Obtener un centro médico por ID
  const getCentroMedicoById = useCallback((id: number): CentroMedico | undefined => {
    return centrosMedicos.find(centro => centro.centroID === id);
  }, [centrosMedicos]);

  // Refrescar datos
  const refresh = useCallback(() => {
    fetchCentrosMedicos();
  }, [fetchCentrosMedicos]);

  // Limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Validaciones para crear/editar centro médico
  const validateCentroMedico = (values: CentroMedicoCreate | CentroMedicoUpdate) => {
    const errors: Record<string, string> = {};
    if (!values.nombre || values.nombre.trim() === '') {
      errors.nombre = 'El nombre es obligatorio';
    } else if (values.nombre.length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    if (!values.direccion || values.direccion.trim() === '') {
      errors.direccion = 'La dirección es obligatoria';
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
    return errors;
  };

  useEffect(() => {
    fetchCentrosMedicos();
  }, [fetchCentrosMedicos]);

  return {
    centrosMedicos: filteredCentros,
    allCentrosMedicos: centrosMedicos,
    loading,
    error,
    fetchCentrosMedicos,
    createCentroMedico,
    updateCentroMedico,
    deleteCentroMedico,
    getCentroMedicoById,
    refresh,
    clearError,
    validateCentroMedico, // <-- exportar validador
    isEmpty: centrosMedicos.length === 0,
    total: centrosMedicos.length,
    filteredTotal: filteredCentros.length
  };
};
