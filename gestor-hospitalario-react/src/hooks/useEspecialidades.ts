import { useState, useEffect } from 'react';
import { especialidadService } from '../services';
import type { Especialidad, EspecialidadCreate, EspecialidadUpdate } from '../@types';

export const useEspecialidades = () => {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEspecialidades = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await especialidadService.getAll();
      setEspecialidades(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar especialidades');
    } finally {
      setLoading(false);
    }
  };

  const createEspecialidad = async (especialidad: EspecialidadCreate): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const newEspecialidad = await especialidadService.create(especialidad);
      setEspecialidades(prev => [...prev, newEspecialidad]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear especialidad');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateEspecialidad = async (id: number, especialidad: EspecialidadUpdate): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updatedEspecialidad = await especialidadService.update(id, especialidad);
      setEspecialidades(prev => 
        prev.map(esp => esp.especialidadID === id ? updatedEspecialidad : esp)
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar especialidad');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteEspecialidad = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await especialidadService.delete(id);
      setEspecialidades(prev => prev.filter(esp => esp.especialidadID !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar especialidad');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Validaciones para crear/editar especialidad
  const validateEspecialidad = (values: EspecialidadCreate | EspecialidadUpdate) => {
    const errors: Record<string, string> = {};
    if (!values.nombre || values.nombre.trim() === '') {
      errors.nombre = 'El nombre es obligatorio';
    } else if (values.nombre.length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    if (!values.descripcion || values.descripcion.trim() === '') {
      errors.descripcion = 'La descripción es obligatoria';
    }
    return errors;
  };

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  return {
    especialidades,
    loading,
    error,
    fetchEspecialidades,
    createEspecialidad,
    updateEspecialidad,
    deleteEspecialidad,
    validateEspecialidad // <-- exportar validador
  };
};
