import { api } from './api';
import type { Especialidad, EspecialidadCreate, EspecialidadUpdate } from '../@types';

export const especialidadService = {
  // Obtener todas las especialidades
  getAll: async (): Promise<Especialidad[]> => {
    const response = await api.get<Especialidad[]>('/Especialidades/Listar');
    return response.data;
  },

  // Obtener una especialidad por ID
  getById: async (id: number): Promise<Especialidad> => {
    const response = await api.get<Especialidad>(`/Especialidades/Obtener/${id}`);
    return response.data;
  },

  // Crear una nueva especialidad
  create: async (especialidad: EspecialidadCreate): Promise<Especialidad> => {
    const response = await api.post<Especialidad>('/Especialidades/Crear', especialidad);
    return response.data;
  },

  // Actualizar una especialidad
  update: async (id: number, especialidad: EspecialidadUpdate): Promise<Especialidad> => {
    const response = await api.put<Especialidad>(`/Especialidades/Actualizar/${id}`, especialidad);
    return response.data;
  },

  // Eliminar una especialidad
  delete: async (id: number): Promise<void> => {
    await api.delete(`/Especialidades/Eliminar/${id}`);
  },

  // Obtener estadísticas de especialidades
  getStats: async (): Promise<{
    total: number;
    activas: number;
    inactivas: number;
    conMedicos: number;
    sinMedicos: number;
  }> => {
    const response = await api.get('/Especialidades/Estadisticas');
    return response.data;
  },

  // Buscar especialidades
  search: async (query: string): Promise<Especialidad[]> => {
    const response = await api.get(`/Especialidades/Buscar?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Obtener especialidades activas
  getActive: async (): Promise<Especialidad[]> => {
    const response = await api.get('/Especialidades/Activas');
    return response.data;
  },

  // Obtener médicos por especialidad
  getDoctors: async (id: number): Promise<any[]> => {
    const response = await api.get(`/Especialidades/Medicos/${id}`);
    return response.data;
  },

  // Activar/Desactivar especialidad
  toggleStatus: async (id: number): Promise<Especialidad> => {
    const response = await api.patch(`/Especialidades/CambiarEstado/${id}`);
    return response.data;
  }
};

export default especialidadService;
