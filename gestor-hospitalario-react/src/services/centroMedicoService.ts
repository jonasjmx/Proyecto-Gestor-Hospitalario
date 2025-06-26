import { api } from './api';
import type { CentroMedico, CentroMedicoCreate, CentroMedicoUpdate } from '../@types';

export const centroMedicoService = {
  // Obtener todos los centros médicos
  getAll: async (): Promise<CentroMedico[]> => {
    const response = await api.get<CentroMedico[]>('/CentrosMedicos/Listar');
    return response.data;
  },

  // Obtener un centro médico por ID
  getById: async (id: number): Promise<CentroMedico> => {
    const response = await api.get<CentroMedico>(`/CentrosMedicos/Obtener/${id}`);
    return response.data;
  },

  // Crear un nuevo centro médico
  create: async (centroMedico: CentroMedicoCreate): Promise<CentroMedico> => {
    const response = await api.post<CentroMedico>('/CentrosMedicos/Crear', centroMedico);
    return response.data;
  },

  // Actualizar un centro médico
  update: async (id: number, centroMedico: CentroMedicoUpdate): Promise<CentroMedico> => {
    const response = await api.put<CentroMedico>(`/CentrosMedicos/Actualizar/${id}`, centroMedico);
    return response.data;
  },

  // Eliminar un centro médico
  delete: async (id: number): Promise<void> => {
    await api.delete(`/CentrosMedicos/Eliminar/${id}`);
  },

  // Obtener estadísticas de centros médicos
  getStats: async (): Promise<{
    total: number;
    activos: number;
    inactivos: number;
    porCiudad: { ciudad: string; cantidad: number }[];
  }> => {
    const response = await api.get('/CentrosMedicos/Estadisticas');
    return response.data;
  },

  // Buscar centros médicos
  search: async (query: string): Promise<CentroMedico[]> => {
    const response = await api.get(`/CentrosMedicos/Buscar?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Filtrar por ciudad
  getByCity: async (ciudad: string): Promise<CentroMedico[]> => {
    const response = await api.get(`/CentrosMedicos/PorCiudad/${encodeURIComponent(ciudad)}`);
    return response.data;
  },

  // Activar/Desactivar centro médico
  toggleStatus: async (id: number): Promise<CentroMedico> => {
    const response = await api.patch(`/CentrosMedicos/CambiarEstado/${id}`);
    return response.data;
  }
};

export default centroMedicoService;
