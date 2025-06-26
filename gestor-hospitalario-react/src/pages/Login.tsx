import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth, useFormValidation } from '../hooks';
import type { UsuarioLogin, UsuarioRegister } from '../@types';
import '../styles/auth.css';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Validación para formulario de login
  const loginForm = useFormValidation<UsuarioLogin>(
    { email: '', password: '' },
    {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      },
      password: {
        required: true,
        minLength: 6
      }
    },
    { 
      validateOnChange: true, 
      validateOnBlur: true, 
      showToastErrors: true 
    }
  );

  // Validación para formulario de registro
  const registerForm = useFormValidation<UsuarioRegister>(
    {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      telefono: '',
      rol: 'Paciente'
    },
    {
      nombre: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
      },
      apellido: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      },
      password: {
        required: true,
        minLength: 6
      },
      telefono: {
        required: true,
        pattern: /^[0-9]{10}$/
      }
    },
    { 
      validateOnChange: true, 
      validateOnBlur: true, 
      showToastErrors: true 
    }
  );

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados para mostrar errores
    Object.keys(loginForm.values).forEach(field => {
      loginForm.setFieldTouched(field as keyof UsuarioLogin);
    });
    
    // Validar después de marcar como tocados
    const isValid = loginForm.validateAll();
    
    if (!isValid) {
      return;
    }

    const success = await login(loginForm.values);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados para mostrar errores
    Object.keys(registerForm.values).forEach(field => {
      registerForm.setFieldTouched(field as keyof UsuarioRegister);
    });
    
    // Validar después de marcar como tocados
    const isValid = registerForm.validateAll();
    
    if (!isValid) {
      return;
    }

    const success = await register(registerForm.values);
    if (success) {
      navigate('/dashboard');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    loginForm.resetForm();
    registerForm.resetForm();
    setShowPassword(false);
  };

  return (
    <div className="login-container">
      {/* Header */}
      <header className="login-header">
        <div className="header-content">
          <h1>
            <i className="fas fa-hospital-alt"></i>
            Sistema Hospitalario
          </h1>
          <p>Gestión integral de pacientes y centros médicos</p>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="auth-container">
        <div className="auth-card">
          {/* Formulario de Login */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="auth-form active">
              <div className="form-header">
                <h2>
                  <i className="fas fa-sign-in-alt"></i>
                  Iniciar Sesión
                </h2>
                <p>Accede a tu cuenta para continuar</p>
              </div>

              <div className="input-group">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={loginForm.values.email}
                  onChange={loginForm.handleChange}
                  onBlur={loginForm.handleBlur}
                  className={loginForm.getFieldError('email') && loginForm.isFieldTouched('email') ? 'error' : ''}
                  required
                />
                {loginForm.getFieldError('email') && loginForm.isFieldTouched('email') && (
                  <span className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {loginForm.getFieldError('email')}
                  </span>
                )}
              </div>

              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Contraseña"
                  value={loginForm.values.password}
                  onChange={loginForm.handleChange}
                  onBlur={loginForm.handleBlur}
                  className={loginForm.getFieldError('password') && loginForm.isFieldTouched('password') ? 'error' : ''}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
                {loginForm.getFieldError('password') && loginForm.isFieldTouched('password') && (
                  <span className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {loginForm.getFieldError('password')}
                  </span>
                )}
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Recordar sesión
                </label>
                <a href="#" onClick={(e) => e.preventDefault()} className="forgot-password">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                className={`auth-button ${loading ? 'loading' : ''} ${!loginForm.isValid ? 'disabled' : ''}`}
                disabled={loading || !loginForm.isValid}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Ingresando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    Ingresar
                  </>
                )}
              </button>

              <div className="form-footer">
                <p>
                  ¿No tienes cuenta?{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleForm(); }}>
                    Regístrate aquí
                  </a>
                </p>
              </div>
            </form>
          ) : (
            /* Formulario de Registro */
            <form onSubmit={handleRegisterSubmit} className="auth-form active register-form">
              <div className="form-header">
                <h2>
                  <i className="fas fa-user-plus"></i>
                  Registro de Usuario
                </h2>
                <p>Crea tu cuenta para acceder al sistema</p>
              </div>

              <div className="form-section">
                <div className="form-section-title">
                  <i className="fas fa-user"></i>
                  Información Personal
                </div>
                
                <div className="form-row">
                  <div className="input-group">
                    <i className="fas fa-user"></i>
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Nombre"
                      value={registerForm.values.nombre}
                      onChange={registerForm.handleChange}
                      onBlur={registerForm.handleBlur}
                      className={registerForm.getFieldError('nombre') && registerForm.isFieldTouched('nombre') ? 'error' : ''}
                      required
                    />
                    {registerForm.getFieldError('nombre') && registerForm.isFieldTouched('nombre') && (
                      <span className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        {registerForm.getFieldError('nombre')}
                      </span>
                    )}
                  </div>

                  <div className="input-group">
                    <i className="fas fa-user"></i>
                    <input
                      type="text"
                      name="apellido"
                      placeholder="Apellido"
                      value={registerForm.values.apellido}
                      onChange={registerForm.handleChange}
                      onBlur={registerForm.handleBlur}
                      className={registerForm.getFieldError('apellido') && registerForm.isFieldTouched('apellido') ? 'error' : ''}
                      required
                    />
                    {registerForm.getFieldError('apellido') && registerForm.isFieldTouched('apellido') && (
                      <span className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        {registerForm.getFieldError('apellido')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="input-group">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={registerForm.values.email}
                    onChange={registerForm.handleChange}
                    onBlur={registerForm.handleBlur}
                    className={registerForm.getFieldError('email') && registerForm.isFieldTouched('email') ? 'error' : ''}
                    required
                  />
                  {registerForm.getFieldError('email') && registerForm.isFieldTouched('email') && (
                    <span className="error-message">
                      <i className="fas fa-exclamation-circle"></i>
                      {registerForm.getFieldError('email')}
                    </span>
                  )}
                </div>

                <div className="input-group">
                  <i className="fas fa-phone"></i>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="Teléfono (10 dígitos)"
                    value={registerForm.values.telefono}
                    onChange={(e) => {
                      // Solo permitir números
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) {
                        registerForm.setValue('telefono', value);
                        // Marcar como tocado si el usuario ya empezó a escribir
                        if (value.length > 0) {
                          registerForm.setFieldTouched('telefono');
                        }
                      }
                    }}
                    onBlur={registerForm.handleBlur}
                    className={registerForm.getFieldError('telefono') && registerForm.isFieldTouched('telefono') ? 'error' : ''}
                    maxLength={10}
                    required
                  />
                  {registerForm.getFieldError('telefono') && registerForm.isFieldTouched('telefono') && (
                    <span className="error-message">
                      <i className="fas fa-exclamation-circle"></i>
                      {registerForm.getFieldError('telefono')}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">
                  <i className="fas fa-lock"></i>
                  Información de Acceso
                </div>
                
                <div className="input-group password-strength">
                  <i className="fas fa-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Contraseña (mínimo 6 caracteres)"
                    value={registerForm.values.password}
                    onChange={registerForm.handleChange}
                    onBlur={registerForm.handleBlur}
                    className={registerForm.getFieldError('password') && registerForm.isFieldTouched('password') ? 'error' : ''}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                  </button>
                  {registerForm.getFieldError('password') && registerForm.isFieldTouched('password') && (
                    <span className="error-message">
                      <i className="fas fa-exclamation-circle"></i>
                      {registerForm.getFieldError('password')}
                    </span>
                  )}
                  {/* Indicador de fortaleza de contraseña */}
                  {registerForm.values.password && (
                    <div className="password-strength-meter">
                      <div 
                        className={`strength-bar ${
                          registerForm.values.password.length >= 8 
                            ? 'strong' 
                            : registerForm.values.password.length >= 6 
                              ? 'medium' 
                              : 'weak'
                        }`}
                      ></div>
                      <span className="strength-text">
                        {registerForm.values.password.length >= 8 
                          ? 'Fuerte' 
                          : registerForm.values.password.length >= 6 
                            ? 'Media' 
                            : 'Débil'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Nota sobre el registro */}
                <div className="info-note">
                  <i className="fas fa-info-circle"></i>
                  <span>Al registrarte, accederás como paciente. Para otros roles, contacta al administrador.</span>
                </div>
              </div>

              <button
                type="submit"
                className={`auth-button ${loading ? 'loading' : ''} ${!registerForm.isValid ? 'disabled' : ''}`}
                disabled={loading || !registerForm.isValid}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Registrando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus"></i>
                    Registrarse
                  </>
                )}
              </button>

              <div className="form-footer">
                <p>
                  ¿Ya tienes cuenta?{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleForm(); }}>
                    Inicia sesión aquí
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Login;