import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import LoginForm from '../components/auth/LoginForm';
import '../assets/css/auth.css'; // Cambia esta línea

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.getCurrentUser()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="login-page">
      <LoginForm />
    </div>
  );
};

export default LoginPage;