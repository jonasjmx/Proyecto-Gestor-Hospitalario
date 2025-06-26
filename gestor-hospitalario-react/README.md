# Sistema de Gestión Hospitalaria - React

Este proyecto ha sido migrado desde una interfaz funcional HTML/CSS/JavaScript a una aplicación React con TypeScript.

## 🚀 Tecnologías Utilizadas

- **React 19** con TypeScript
- **React Router DOM** para navegación
- **Axios** para comunicación con la API
- **Vite** como bundler
- **CSS3** con variables personalizadas

## 📁 Estructura del Proyecto

```
src/
├── @types/           # Definiciones de tipos TypeScript
├── components/       # Componentes reutilizables
├── hooks/           # Custom hooks
├── pages/           # Páginas principales
├── services/        # Servicios para API
├── styles/          # Estilos CSS
├── App.tsx          # Componente principal
└── main.tsx         # Punto de entrada
```

## 🔧 Instalación

```bash
cd gestor-hospitalario-react
npm install
npm run dev
```

## 📱 Funcionalidades

- **Autenticación**: Login y registro
- **Gestión de Datos**: CRUD para centros médicos, consultas, empleados, especialidades y médicos
- **Interfaz Responsive**: Diseño adaptativo para todos los dispositivos
- **Búsqueda en Tiempo Real**: Filtrado dinámico en todas las tablas
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
