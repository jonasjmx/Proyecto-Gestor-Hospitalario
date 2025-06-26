import { useState, useEffect, useCallback } from 'react';
import { empleadoService } from '../services';
import type { Empleado, EmpleadoCreate, EmpleadoUpdate } from '../@types';
import toast from 'react-hot-toast';

export const useEmpleados = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  // Cargar todos los empleados
  const fetchEmpleados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await empleadoService.getAll();
      setEmpleados(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar empleados';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar estadísticas
  const loadStats = useCallback(async () => {
    try {
      const data = await empleadoService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  }, []);

  // Crear empleado
  const createEmpleado = async (empleado: EmpleadoCreate): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const newEmpleado = await empleadoService.create(empleado);
      setEmpleados(prev => [...prev, newEmpleado]);
      toast.success('Empleado creado exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear empleado';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar empleado
  const updateEmpleado = async (id: number, empleado: EmpleadoUpdate): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updatedEmpleado = await empleadoService.update(id, empleado);
      setEmpleados(prev => 
        prev.map(emp => emp.empleadoID === id ? updatedEmpleado : emp)
      );
      toast.success('Empleado actualizado exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar empleado';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar empleado
  const deleteEmpleado = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await empleadoService.delete(id);
      setEmpleados(prev => prev.filter(emp => emp.empleadoID !== id));
      toast.success('Empleado eliminado exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar empleado';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Buscar empleados
  const searchEmpleados = useCallback(async (query: string) => {
    try {
      setLoading(true);
      const data = await empleadoService.search(query);
      setEmpleados(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en la búsqueda';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrar por departamento
  const filterByDepartment = useCallback(async (departamento: string) => {
    try {
      setLoading(true);
      const data = await empleadoService.getByDepartment(departamento);
      setEmpleados(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al filtrar por departamento';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cambiar estado
  const toggleStatus = useCallback(async (id: number): Promise<boolean> => {
    try {
      const updatedEmpleado = await empleadoService.toggleStatus(id);
      setEmpleados(prev => prev.map(emp => 
        emp.empleadoID === id ? updatedEmpleado : emp
      ));
      toast.success('Estado cambiado exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado';
      toast.error(errorMessage);
      return false;
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    fetchEmpleados();
    loadStats();
  }, [fetchEmpleados, loadStats]);

  return {
    empleados,
    loading,
    error,
    stats,
    fetchEmpleados,
    loadStats,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    searchEmpleados,
    filterByDepartment,
    toggleStatus
  };
};
