import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import '../assets/css/dashboard.css'; // Cambia esta línea

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Panel de Control</h1>
        <div>
          <span>Bienvenido, {user?.name}</span>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>
      <main>
        {/* Contenido del dashboard */}
      </main>
    </div>
  );
};

export default DashboardPage;