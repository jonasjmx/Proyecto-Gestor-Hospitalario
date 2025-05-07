document.addEventListener('DOMContentLoaded', function() {
    // Configuración de la API
    const API_BASE_URL = 'https://localhost:44346/api/Usuarios';
    
    // Elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    
    // Mostrar formulario de registro
    function showRegister() {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        clearErrorMessages();
    }
    
    // Mostrar formulario de login
    function showLogin() {
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
        clearErrorMessages();
    }
    
    // Limpiar mensajes de error
    function clearErrorMessages() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
    }
    
    // Mostrar mensaje de error
    function showError(element, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'red';
        errorElement.style.marginTop = '5px';
        errorElement.style.fontSize = '0.8rem';
        errorElement.textContent = message;
        element.parentNode.insertBefore(errorElement, element.nextSibling);
    }
    
    // Toggle para mostrar/ocultar contraseña
    function setupPasswordToggle() {
        togglePasswordBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        });
    }
    
    // Función para hacer login
    async function handleLogin(email, password) {
        try {
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ingresando...';
            
            const response = await fetch(`${API_BASE_URL}/Login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            
            // Verificar si la respuesta es HTML (error del servidor)
            const responseText = await response.text();
            if (responseText.startsWith('<!DOCTYPE html') || responseText.includes('<html')) {
                throw new Error('Error interno del servidor. Intente nuevamente más tarde.');
            }
            
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Error parsing JSON:', e);
                throw new Error('Error procesando la respuesta del servidor');
            }
            
            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
            }
            
            // Verificar estructura mínima de respuesta
            if (!data || data.UsuarioID === undefined) {
                throw new Error('Respuesta inesperada del servidor');
            }
            
            // Guardar datos de usuario
            localStorage.setItem('userData', JSON.stringify({
                id: data.UsuarioID,
                nombre: data.Nombre || '',
                rol: data.Rol || '0', // Valor por defecto si no viene
                email: email
            }));
            
            // Redirigir
            window.location.href = '../HTML/index.html';
            
        } catch (error) {
            console.error('Error en login:', error);
            showError(loginForm.querySelector('input[type="password"]'), 
                     error.message.includes('Error interno') ? 
                     error.message : 
                     'Usuario o contraseña incorrectos');
        } finally {
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Ingresar';
            }
        }
    }
    function redirectByRole(rol) {
        const redirectPaths = {
            '0': '../HTML/index.html',  // Ejemplo: Administrador
            '0': '/doctor/agenda.html',    // Ejemplo: Doctor
            '0': '/paciente/citas.html'    // Ejemplo: Paciente
        };
        
        const path = redirectPaths[rol] || '../HTML/index.html';
        window.location.href = path;
    }
    
    // Función para registrar usuario
    async function handleRegister(formElement) {
        try {
            const submitBtn = formElement.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
            
            // Obtener valores del formulario
            const formData = {
                nombre: formElement.querySelector('[name="nombre"]').value.trim(),
                apellido: formElement.querySelector('[name="apellido"]').value.trim(),
                sexo: parseInt(formElement.querySelector('[name="sexo"]').value) || 0,
                fechaNacimiento: new Date(formElement.querySelector('[name="fechaNacimiento"]').value).toISOString(),
                direcciOn: formElement.querySelector('[name="direccion"]').value.trim(), // Asegúrate que coincida con el modelo
                telefono: formElement.querySelector('[name="telefono"]').value.trim(),
                email: formElement.querySelector('[name="email"]').value.trim(),
                password: formElement.querySelector('[name="password"]').value,
                rol: 0 // Rol de admin
            };
            
            // Validar campos requeridos
            if (!formData.nombre) throw new Error('El nombre es requerido');
            if (!formData.apellido) throw new Error('El apellido es requerido');
            if (!formData.email) throw new Error('El email es requerido');
            if (!formData.password) throw new Error('La contraseña es requerida');
            //if (!formData.DirecciOn) throw new Error('La dirección es requerida'); // Validación añadida
            if (!formElement.querySelector('[name="fechaNacimiento"]').value) throw new Error('La fecha de nacimiento es requerida');
            
            // Validar confirmación de contraseña
            const confirmPassword = formElement.querySelector('[name="confirmPassword"]').value;
            if (formData.password !== confirmPassword) {
                throw new Error('Las contraseñas no coinciden');
            }
            
            // Validar formato de email
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                throw new Error('Ingrese un email válido');
            }
            
            const response = await fetch(`${API_BASE_URL}/Crear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const responseData = await response.text();
            let data;
            
            try {
                data = JSON.parse(responseData);
            } catch {
                throw new Error(responseData.includes('<html') ? 
                    'Error en el servidor. Contacte al administrador' : 
                    responseData);
            }
            
            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}`);
            }
            
            alert('Registro exitoso! Por favor inicia sesión');
            showLogin();
            
        } catch (error) {
            console.error('Error en registro:', error);
            showError(formElement.querySelector('[name="email"]'), error.message);
        } finally {
            const submitBtn = formElement.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Registrarse';
            }
        }
    }
    
    // Manejo de envío de formularios
    function handleFormSubmit() {
        // Login
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value.trim();
            const password = this.querySelector('input[type="password"]').value;
            
            if (!email || !password) {
                showError(this.querySelector('input[type="password"]'), 'Email y contraseña son requeridos');
                return;
            }
            
            await handleLogin(email, password);
        });
        
        // Registro
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleRegister(this);
        });
    }
    
    // Event Listeners
    showRegisterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showRegister();
    });
    
    showLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showLogin();
    });
    
    // Inicialización
    function init() {
        setupPasswordToggle();
        handleFormSubmit();
        showLogin();
        
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                const data = JSON.parse(userData);
                if (data.id) {
                    redirectByRole(data.rol);
                }
            } catch {
                localStorage.removeItem('userData');
            }
        }
    }
    
    init();
});