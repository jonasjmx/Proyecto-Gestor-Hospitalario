import { api } from './api';
import type { Consulta, ConsultaCreate, ConsultaUpdate } from '../@types';

export const consultaService = {
  // Obtener todas las consultas
  getAll: async (): Promise<Consulta[]> => {
    const response = await api.get<Consulta[]>('/Consultas/Listar');
    return response.data;
  },

  // Obtener una consulta por ID
  getById: async (id: number): Promise<Consulta> => {
    const response = await api.get<Consulta>(`/Consultas/Obtener/${id}`);
    return response.data;
  },

  // Crear una nueva consulta
  create: async (consulta: ConsultaCreate): Promise<Consulta> => {
    const response = await api.post<Consulta>('/Consultas/Crear', consulta);
    return response.data;
  },

  // Actualizar una consulta
  update: async (id: number, consulta: ConsultaUpdate): Promise<Consulta> => {
    const response = await api.put<Consulta>(`/Consultas/Actualizar/${id}`, consulta);
    return response.data;
  },

  // Eliminar una consulta
  delete: async (id: number): Promise<void> => {
    await api.delete(`/Consultas/Eliminar/${id}`);
  },

  // Obtener estadísticas de consultas
  getStats: async (): Promise<{
    total: number;
    pendientes: number;
    completadas: number;
    canceladas: number;
    porMes: { mes: string; cantidad: number }[];
    porEspecialidad: { especialidad: string; cantidad: number }[];
  }> => {
    const response = await api.get('/Consultas/Estadisticas');
    return response.data;
  },

  // Buscar consultas
  search: async (query: string): Promise<Consulta[]> => {
    const response = await api.get(`/Consultas/Buscar?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Obtener consultas por paciente
  getByPatient: async (pacienteId: number): Promise<Consulta[]> => {
    const response = await api.get(`/Consultas/PorPaciente/${pacienteId}`);
    return response.data;
  },

  // Obtener consultas por médico
  getByDoctor: async (medicoId: number): Promise<Consulta[]> => {
    const response = await api.get(`/Consultas/PorMedico/${medicoId}`);
    return response.data;
  },

  // Obtener consultas por fecha
  getByDate: async (fecha: string): Promise<Consulta[]> => {
    const response = await api.get(`/Consultas/PorFecha/${fecha}`);
    return response.data;
  },

  // Cambiar estado de consulta
  changeStatus: async (id: number, estado: string): Promise<Consulta> => {
    const response = await api.patch(`/Consultas/CambiarEstado/${id}`, { estado });
    return response.data;
  },

  // Obtener consultas del día
  getToday: async (): Promise<Consulta[]> => {
    const response = await api.get('/Consultas/Hoy');
    return response.data;
  },

  // Obtener próximas consultas
  getUpcoming: async (): Promise<Consulta[]> => {
    const response = await api.get('/Consultas/Proximas');
    return response.data;
  }
};

export default consultaService;
