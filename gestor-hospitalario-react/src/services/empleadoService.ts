import { api } from './api';
import type { Empleado, EmpleadoCreate, EmpleadoUpdate } from '../@types';

export const empleadoService = {
  // Obtener todos los empleados
  getAll: async (): Promise<Empleado[]> => {
    const response = await api.get<Empleado[]>('/Empleados/Listar');
    return response.data;
  },

  // Obtener un empleado por ID
  getById: async (id: number): Promise<Empleado> => {
    const response = await api.get<Empleado>(`/Empleados/Obtener/${id}`);
    return response.data;
  },

  // Crear un nuevo empleado
  create: async (empleado: EmpleadoCreate): Promise<Empleado> => {
    const response = await api.post<Empleado>('/Empleados/Crear', empleado);
    return response.data;
  },

  // Actualizar un empleado
  update: async (id: number, empleado: EmpleadoUpdate): Promise<Empleado> => {
    const response = await api.put<Empleado>(`/Empleados/Actualizar/${id}`, empleado);
    return response.data;
  },

  // Eliminar un empleado
  delete: async (id: number): Promise<void> => {
    await api.delete(`/Empleados/Eliminar/${id}`);
  },

  // Obtener estadísticas de empleados
  getStats: async (): Promise<{
    total: number;
    activos: number;
    inactivos: number;
    porDepartamento: { departamento: string; cantidad: number }[];
    porCargo: { cargo: string; cantidad: number }[];
  }> => {
    const response = await api.get('/Empleados/Estadisticas');
    return response.data;
  },

  // Buscar empleados
  search: async (query: string): Promise<Empleado[]> => {
    const response = await api.get(`/Empleados/Buscar?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Filtrar por departamento
  getByDepartment: async (departamento: string): Promise<Empleado[]> => {
    const response = await api.get(`/Empleados/PorDepartamento/${encodeURIComponent(departamento)}`);
    return response.data;
  },

  // Filtrar por cargo
  getByPosition: async (cargo: string): Promise<Empleado[]> => {
    const response = await api.get(`/Empleados/PorCargo/${encodeURIComponent(cargo)}`);
    return response.data;
  },

  // Activar/Desactivar empleado
  toggleStatus: async (id: number): Promise<Empleado> => {
    const response = await api.patch(`/Empleados/CambiarEstado/${id}`);
    return response.data;
  }
};

export default empleadoService;
