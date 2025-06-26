import { api } from './api';
import type { Paciente, PacienteCreate, PacienteUpdate } from '../@types';

export const pacienteService = {
  // Obtener todos los pacientes
  getAll: async (): Promise<Paciente[]> => {
    const response = await api.get<Paciente[]>('/Pacientes/Listar');
    return response.data;
  },

  // Obtener un paciente por ID
  getById: async (id: number): Promise<Paciente> => {
    const response = await api.get<Paciente>(`/Pacientes/Obtener/${id}`);
    return response.data;
  },

  // Crear un nuevo paciente
  create: async (paciente: PacienteCreate): Promise<Paciente> => {
    const response = await api.post<Paciente>('/Pacientes/Crear', paciente);
    return response.data;
  },

  // Actualizar un paciente
  update: async (id: number, paciente: PacienteUpdate): Promise<Paciente> => {
    const response = await api.put<Paciente>(`/Pacientes/Actualizar/${id}`, paciente);
    return response.data;
  },

  // Eliminar un paciente
  delete: async (id: number): Promise<void> => {
    await api.delete(`/Pacientes/Eliminar/${id}`);
  },

  // Obtener estadísticas de pacientes
  getStats: async (): Promise<{
    total: number;
    activos: number;
    inactivos: number;
    porEdad: { rango: string; cantidad: number }[];
    porGenero: { genero: string; cantidad: number }[];
  }> => {
    const response = await api.get('/Pacientes/Estadisticas');
    return response.data;
  },

  // Buscar pacientes
  search: async (query: string): Promise<Paciente[]> => {
    const response = await api.get(`/Pacientes/Buscar?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Obtener historial médico
  getMedicalHistory: async (id: number): Promise<any[]> => {
    const response = await api.get(`/Pacientes/HistorialMedico/${id}`);
    return response.data;
  },

  // Obtener consultas de un paciente
  getConsultations: async (id: number): Promise<any[]> => {
    const response = await api.get(`/Pacientes/Consultas/${id}`);
    return response.data;
  },

  // Activar/Desactivar paciente
  toggleStatus: async (id: number): Promise<Paciente> => {
    const response = await api.patch(`/Pacientes/CambiarEstado/${id}`);
    return response.data;
  }
};

export default pacienteService;
