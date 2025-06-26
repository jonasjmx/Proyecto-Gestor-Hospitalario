import { api } from './api';
import type { Usuario, UsuarioLogin, UsuarioRegister, UsuarioCreate, UsuarioUpdate } from '../@types';

export const usuarioService = {
  // Login
  login: async (credentials: UsuarioLogin): Promise<Usuario> => {
    const response = await api.post<Usuario>('/Usuarios/Login', credentials);
    return response.data;
  },

  // Registro
  register: async (userData: UsuarioRegister): Promise<Usuario> => {
    const response = await api.post<Usuario>('/Usuarios/Registro', userData);
    return response.data;
  },

  // Obtener todos los usuarios
  getAll: async (): Promise<Usuario[]> => {
    const response = await api.get<Usuario[]>('/Usuarios/Listar');
    return response.data;
  },

  // Obtener un usuario por ID
  getById: async (id: number): Promise<Usuario> => {
    const response = await api.get<Usuario>(`/Usuarios/Obtener/${id}`);
    return response.data;
  },

  // Crear un nuevo usuario
  create: async (usuario: UsuarioCreate): Promise<Usuario> => {
    const response = await api.post<Usuario>('/Usuarios/Crear', usuario);
    return response.data;
  },

  // Actualizar un usuario
  update: async (id: number, usuario: UsuarioUpdate): Promise<Usuario> => {
    const response = await api.put<Usuario>(`/Usuarios/Actualizar/${id}`, usuario);
    return response.data;
  },

  // Eliminar un usuario
  delete: async (id: number): Promise<void> => {
    await api.delete(`/Usuarios/Eliminar/${id}`);
  }
};
