import { Routes, Route, Navigate } from 'react-router-dom';
import { Login, CentrosMedicos, Consultas, Empleados, Especialidades, Medicos, DashboardPage } from './pages';
import { ProtectedRoute, UnauthorizedPage } from './components';
import { useAuth } from './contexts';
import './styles/globals.css';
import './styles/modal.css';

// Componente para manejar la redirección inicial
const AuthRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Dashboard principal */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        {/* Rutas protegidas */}
        <Route path="/centros-medicos" element={
          <ProtectedRoute>
            <CentrosMedicos />
          </ProtectedRoute>
        } />
        
        <Route path="/consultas" element={
          <ProtectedRoute>
            <Consultas />
          </ProtectedRoute>
        } />
        
        <Route path="/empleados" element={
          <ProtectedRoute>
            <Empleados />
          </ProtectedRoute>
        } />
        
        <Route path="/especialidades" element={
          <ProtectedRoute>
            <Especialidades />
          </ProtectedRoute>
        } />
        
        <Route path="/medicos" element={
          <ProtectedRoute>
            <Medicos />
          </ProtectedRoute>
        } />
        
        {/* Página de acceso no autorizado */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Redirección por defecto basada en autenticación */}
        <Route path="/" element={<AuthRedirect />} />
        
        {/* Ruta 404 - redirige a la página inicial */}
        <Route path="*" element={<AuthRedirect />} />
      </Routes>
    </div>
  );
}

export default App;
