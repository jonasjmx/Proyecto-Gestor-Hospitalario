import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { usuarioService } from '../services';
import type { Usuario, UsuarioLogin, UsuarioRegister } from '../@types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  error: string | null;
  login: (credentials: UsuarioLogin) => Promise<boolean>;
  register: (userData: UsuarioRegister) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMedico: boolean;
  isEmpleado: boolean;
  isPaciente: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true); // Start with true to check initial auth state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (err) {
        console.error('Error parsing saved user data:', err);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: UsuarioLogin): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await usuarioService.login(credentials);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success(`¡Bienvenido, ${userData.nombre}!`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      toast.error('Credenciales incorrectas. Verifica tu email y contraseña.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: UsuarioRegister): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const newUser = await usuarioService.register(userData);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast.success(`¡Cuenta creada exitosamente! Bienvenido, ${newUser.nombre}!`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrarse';
      setError(errorMessage);
      toast.error('Error al crear la cuenta. Verifica que el email no esté registrado.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Sesión cerrada exitosamente');
  };

  const hasRole = (role: string): boolean => {
    return user?.rol === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.rol) : false;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Definir permisos por rol
    const rolePermissions = {
      Administrador: ['create', 'read', 'update', 'delete', 'manage_users', 'manage_system'],
      Medico: ['read', 'update', 'create_consulta', 'read_consulta'],
      Empleado: ['read', 'update', 'create_paciente', 'read_paciente'],
      Paciente: ['read']
    };

    const userPermissions = rolePermissions[user.rol as keyof typeof rolePermissions] || [];
    return userPermissions.includes(permission);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    hasRole,
    hasAnyRole,
    hasPermission,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'Administrador',
    isMedico: user?.rol === 'Medico',
    isEmpleado: user?.rol === 'Empleado',
    isPaciente: user?.rol === 'Paciente'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
