import { useState, useEffect, useCallback } from 'react';
import { consultaService } from '../services';
import type { Consulta, ConsultaCreate, ConsultaUpdate } from '../@types';
import toast from 'react-hot-toast';

export const useConsultas = () => {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  // Cargar todas las consultas
  const fetchConsultas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await consultaService.getAll();
      setConsultas(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar consultas';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar estadísticas
  const loadStats = useCallback(async () => {
    try {
      const data = await consultaService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  }, []);

  // Crear consulta
  const createConsulta = async (consulta: ConsultaCreate): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const newConsulta = await consultaService.create(consulta);
      setConsultas(prev => [...prev, newConsulta]);
      toast.success('Consulta creada exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear consulta';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar consulta
  const updateConsulta = async (id: number, consulta: ConsultaUpdate): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updatedConsulta = await consultaService.update(id, consulta);
      setConsultas(prev => 
        prev.map(c => c.consultaID === id ? updatedConsulta : c)
      );
      toast.success('Consulta actualizada exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar consulta';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar consulta
  const deleteConsulta = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await consultaService.delete(id);
      setConsultas(prev => prev.filter(c => c.consultaID !== id));
      toast.success('Consulta eliminada exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar consulta';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Buscar consultas
  const searchConsultas = useCallback(async (query: string) => {
    try {
      setLoading(true);
      const data = await consultaService.search(query);
      setConsultas(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en la búsqueda';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrar por paciente
  const filterByPatient = useCallback(async (pacienteId: number) => {
    try {
      setLoading(true);
      const data = await consultaService.getByPatient(pacienteId);
      setConsultas(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al filtrar por paciente';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cambiar estado
  const changeStatus = useCallback(async (id: number, estado: string): Promise<boolean> => {
    try {
      const updatedConsulta = await consultaService.changeStatus(id, estado);
      setConsultas(prev => prev.map(c => 
        c.consultaID === id ? updatedConsulta : c
      ));
      toast.success('Estado de consulta actualizado');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado';
      toast.error(errorMessage);
      return false;
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    fetchConsultas();
    loadStats();
  }, [fetchConsultas, loadStats]);

  return {
    consultas,
    loading,
    error,
    stats,
    fetchConsultas,
    loadStats,
    createConsulta,
    updateConsulta,
    deleteConsulta,
    searchConsultas,
    filterByPatient,
    changeStatus
  };
};
