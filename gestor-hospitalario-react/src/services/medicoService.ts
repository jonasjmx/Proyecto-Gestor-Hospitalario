import { api } from './api';
import type { Medico, MedicoCreate, MedicoUpdate } from '../@types';

export const medicoService = {
  // Obtener todos los médicos
  getAll: async (): Promise<Medico[]> => {
    const response = await api.get<Medico[]>('/Medicos/Listar');
    return response.data;
  },

  // Obtener un médico por ID
  getById: async (id: number): Promise<Medico> => {
    const response = await api.get<Medico>(`/Medicos/Obtener/${id}`);
    return response.data;
  },

  // Crear un nuevo médico
  create: async (medico: MedicoCreate): Promise<Medico> => {
    const response = await api.post<Medico>('/Medicos/Crear', medico);
    return response.data;
  },

  // Actualizar un médico
  update: async (id: number, medico: MedicoUpdate): Promise<Medico> => {
    const response = await api.put<Medico>(`/Medicos/Actualizar/${id}`, medico);
    return response.data;
  },

  // Eliminar un médico
  delete: async (id: number): Promise<void> => {
    await api.delete(`/Medicos/Eliminar/${id}`);
  },

  // Obtener estadísticas de médicos
  getStats: async (): Promise<{
    total: number;
    disponibles: number;
    ocupados: number;
    porEspecialidad: { especialidad: string; cantidad: number }[];
    porTurno: { turno: string; cantidad: number }[];
  }> => {
    const response = await api.get('/Medicos/Estadisticas');
    return response.data;
  },

  // Buscar médicos
  search: async (query: string): Promise<Medico[]> => {
    const response = await api.get(`/Medicos/Buscar?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Obtener médicos por especialidad
  getBySpecialty: async (especialidadId: number): Promise<Medico[]> => {
    const response = await api.get(`/Medicos/PorEspecialidad/${especialidadId}`);
    return response.data;
  },

  // Obtener médicos disponibles
  getAvailable: async (): Promise<Medico[]> => {
    const response = await api.get('/Medicos/Disponibles');
    return response.data;
  },

  // Cambiar estado de disponibilidad
  toggleAvailability: async (id: number): Promise<Medico> => {
    const response = await api.patch(`/Medicos/CambiarDisponibilidad/${id}`);
    return response.data;
  },

  // Obtener horarios de un médico
  getSchedule: async (id: number): Promise<any[]> => {
    const response = await api.get(`/Medicos/Horarios/${id}`);
    return response.data;
  }
};

export default medicoService;
