import { useAuth } from './useAuth';
import type { UserRole, RolePermissions } from '../@types';

// Configuración de permisos por rol
const rolePermissions: Record<UserRole, Record<string, RolePermissions>> = {
  Administrador: {
    centrosMedicos: { canRead: true, canCreate: true, canUpdate: true, canDelete: true },
    consultas: { canRead: true, canCreate: true, canUpdate: true, canDelete: true },
    empleados: { canRead: true, canCreate: true, canUpdate: true, canDelete: true },
    especialidades: { canRead: true, canCreate: true, canUpdate: true, canDelete: true },
    medicos: { canRead: true, canCreate: true, canUpdate: true, canDelete: true },
    usuarios: { canRead: true, canCreate: true, canUpdate: true, canDelete: true }
  },
  Medico: {
    centrosMedicos: { canRead: true, canCreate: false, canUpdate: false, canDelete: false },
    consultas: { canRead: true, canCreate: true, canUpdate: true, canDelete: false },
    empleados: { canRead: true, canCreate: false, canUpdate: false, canDelete: false },
    especialidades: { canRead: true, canCreate: false, canUpdate: false, canDelete: false },
    medicos: { canRead: true, canCreate: false, canUpdate: true, canDelete: false },
    usuarios: { canRead: false, canCreate: false, canUpdate: false, canDelete: false }
  },
  Empleado: {
    centrosMedicos: { canRead: true, canCreate: false, canUpdate: false, canDelete: false },
    consultas: { canRead: true, canCreate: false, canUpdate: false, canDelete: false },
    empleados: { canRead: true, canCreate: false, canUpdate: false, canDelete: false },
    especialidades: { canRead: true, canCreate: false, canUpdate: false, canDelete: false },
    medicos: { canRead: true, canCreate: false, canUpdate: false, canDelete: false },
    usuarios: { canRead: false, canCreate: false, canUpdate: false, canDelete: false }
  },
  Paciente: {
    centrosMedicos: { canRead: true, canCreate: false, canUpdate: false, canDelete: false },
    consultas: { canRead: true, canCreate: false, canUpdate: false, canDelete: false },
    empleados: { canRead: false, canCreate: false, canUpdate: false, canDelete: false },
    especialidades: { canRead: true, canCreate: false, canUpdate: false, canDelete: false },
    medicos: { canRead: true, canCreate: false, canUpdate: false, canDelete: false },
    usuarios: { canRead: false, canCreate: false, canUpdate: false, canDelete: false }
  }
};

// Rutas permitidas por rol
const allowedRoutes: Record<UserRole, string[]> = {
  Administrador: ['/centros-medicos', '/consultas', '/empleados', '/especialidades', '/medicos'],
  Medico: ['/centros-medicos', '/consultas', '/empleados', '/especialidades', '/medicos'],
  Empleado: ['/centros-medicos', '/consultas', '/empleados', '/especialidades', '/medicos'],
  Paciente: ['/centros-medicos', '/consultas', '/especialidades', '/medicos']
};

export const useRolePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (module: string, action: keyof RolePermissions): boolean => {
    if (!user || !user.rol) return false;
    
    const modulePermissions = rolePermissions[user.rol]?.[module];
    return modulePermissions?.[action] || false;
  };

  const canAccessRoute = (route: string): boolean => {
    if (!user || !user.rol) return false;
    
    return allowedRoutes[user.rol]?.includes(route) || false;
  };

  const getPermissions = (module: string): RolePermissions => {
    if (!user || !user.rol) {
      return { canRead: false, canCreate: false, canUpdate: false, canDelete: false };
    }
    
    return rolePermissions[user.rol]?.[module] || 
           { canRead: false, canCreate: false, canUpdate: false, canDelete: false };
  };

  const getAllowedRoutes = (): string[] => {
    if (!user || !user.rol) return [];
    
    return allowedRoutes[user.rol] || [];
  };

  return {
    hasPermission,
    canAccessRoute,
    getPermissions,
    getAllowedRoutes,
    userRole: user?.rol
  };
};
