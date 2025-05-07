export const authService = {
    login: async (credentials) => {
      // Simulación de API
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (credentials.email === 'admin@hospital.com' && credentials.password === 'hospital123') {
            resolve({
              user: {
                id: 1,
                name: 'Admin Hospital',
                email: credentials.email,
                token: 'fake-jwt-token'
              }
            });
          } else {
            reject(new Error('Credenciales incorrectas'));
          }
        }, 1000);
      });
    },
    logout: () => {
      localStorage.removeItem('authUser');
      return Promise.resolve();
    },
    getCurrentUser: () => {
      const user = localStorage.getItem('authUser');
      return user ? JSON.parse(user) : null;
    }
  };