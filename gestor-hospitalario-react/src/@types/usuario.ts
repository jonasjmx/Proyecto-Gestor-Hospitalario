export interface Usuario {
  usuarioID: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: 'Administrador' | 'Medico' | 'Empleado' | 'Paciente';
  fechaRegistro: string;
  activo: boolean;
}

export interface UsuarioLogin {
  email: string;
  password: string;
}

export interface UsuarioRegister {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
  rol: 'Administrador' | 'Medico' | 'Empleado' | 'Paciente';
}

export interface UsuarioCreate extends UsuarioRegister {}

export interface UsuarioUpdate {
  usuarioID: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: 'Administrador' | 'Medico' | 'Empleado' | 'Paciente';
  activo: boolean;
}

export type UserRole = 'Administrador' | 'Medico' | 'Empleado' | 'Paciente';

export interface RolePermissions {
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}
