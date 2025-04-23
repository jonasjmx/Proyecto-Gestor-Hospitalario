# Proyecto Gestor Hospitalario

## 📚 SGM - Sistema de Centros Medicos
Este proyecto es un sistema de gestión académica completo, compuesto por una API RESTful desarrollada en ASP.NET Core, conectada a una base de datos MySQL en maquinas virtuales con Ubuntu server 24, con una interfaz web básica (HTML + JS) para gestionar en los centro Medicos los Empleados, Medicos, consultas medicas y especialidades.

## 🏥 Sistema de Gestión Hospitalaria Distribuido
## 🧰 Tecnologías Utilizadas
Componente	Tecnología
Backend	ASP.NET Core 7, Entity Framework Core, Swagger/OpenAPI
Base de Datos	MySQL 8.0 (Configuración distribuida Maestro-Esclavo)
Frontend	HTML5, CSS3, JavaScript (Vanilla)
Infraestructura	3 VMs Ubuntu Server 24.04 (VirtualBox)
Seguridad	CORS Policies, Validaciones en capa de controlador
DevOps	Configuración manual de replicación MySQL

```
Gestor_Hospitalario/
├── 📁 Context/
│   └── HospitalContext.cs           # Configuración EF Core y DbSets
├── 📁 Controllers/
│   ├── CentrosMedicosController.cs  # 350+ líneas (CRUD completo)
│   ├── ConsultaMedicaController.cs  # Con validación de horarios
│   ├── EmpleadoController.cs        # Gestión de personal administrativo
│   ├── EspecialidadesController.cs  # Simple CRUD
│   └── MedicoController.cs          # Relación con especialidades
├── 📁 DTos/
│   ├── CentroMedico/                # Separación por entidad
│   │   ├── CreateDTO.cs             # Validaciones Required
│   │   ├── ReadDTO.cs               # Proyecciones seguras
│   │   └── UpdateDTO.cs             # 
│   ├── ConsultaMedica/              # DTOs para consultas
│   └── ...                          # Similar estructura para otras entidades
├── 📁 Models/
│   ├── CentroMedico.cs              # Modelo principal
│   ├── ConsultaMedica.cs            # Con relaciones
│   ├── Empleado.cs                  # 
│   ├── Especialidad.cs              # 
│   └── Medico.cs                    # Relación N:1 con Especialidad
├── 📁 Migrations/                    # Historial de migraciones EF
├── 📁 wwwroot/
│   ├── 📁 css/                       # Styles.css + Normalize
│   ├── 📁 js/                        # 5 archivos modularizados
│   │   ├── main.js                  # Lógica principal
│   │   └── entidades/               # JS por módulo
│   └── index.html                   # Interfaz única con tabs
├── appsettings.json                 # Cadenas de conexión
├── Program.cs                       # Configuración CORS y Swagger
└── Infraestructura.md               # Guía de configuración VMs
```

## 🗃️ Diagrama de Base de Datos
![deepseek_mermaid_20250423_b8cecc](https://github.com/user-attachments/assets/6a493428-6c5f-48af-bb8e-cbc543b173b8)

## 🔄 Diagrama de Flujo - Creación de Consulta Médica
![deepseek_mermaid_20250423_6d0bae](https://github.com/user-attachments/assets/095933bd-b3b3-4004-9d2e-31570ffd28de)

## 📊 Estructura de la API REST
```csharp
{
  "CentrosMedicos": {
    "Endpoints": {
      "GET Listar": "/api/CentrosMedicos/Listar",
      "POST Crear": {
        "Body": {
          "Nombre": "string (required)",
          "Direccion": "string (required)",
          "Telefono": "string (required)",
          "Email": "string (required)"
        },
        "Validaciones": [
          "Nombre único por dirección",
          "Formato email válido"
        ]
      }
    },
    "EjemploResponse": {
      "CentroID": 1,
      "Nombre": "Hospital Central",
      "Direccion": "Av. Principal 123",
      "Telefono": "022345678",
      "Email": "contacto@hospitalcentral.com"
    }
  }
}
```

## 🖥️ Diagrama de Componentes
```
+-------------+       +-------------+       +-------------------+
|  Frontend   |       |  Backend    |       |  Infraestructura  |
+-------------+       +-------------+       +-------------------+
|             |       |             |       |                   |
| [Interfaz   | HTTP/ | [Controla-  |       |    [VM Master]    |
|  Web]       | REST  |  dores]     |       |        |          |
|     |       |       |     |       | Conex.|        |          |
| [API Fetch] |       | [Servicios] | BD    | [MySQL Primary]   |
|             |       |     |       |       |                   |
+-------------+       | [Repositorio]|       |    [VM Slave 1]   |
                      |     |       |       |        |          |
                      | [MySQL]     |       | [MySQL Replica]   |
                      |             |       |                   |
                      +-------------+       |    [VM Slave 2]   |
                                            |        |          |
                                            | [MySQL Replica]   |
                                            |                   |
                                            +-------------------+
```

## 🖥️ Diagrama Técnico:
![deepseek_mermaid_20250423_0cf52f](https://github.com/user-attachments/assets/c6bdfc40-00cc-4419-a694-658c7a00195d)

## 🔐 Políticas de Seguridad Implementadas
CORS Configurado (Program.cs):
```csharp
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => 
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});
```
Validaciones en DTOs:
```csharp
public class CentroMedicoCreateDTO {
    [Required(ErrorMessage = "El nombre es obligatorio")]
    [StringLength(100, MinimumLength = 5)]
    public string Nombre { get; set; }
    
    [Required]
    [RegularExpression(@"^[0-9]{7,15}$", ErrorMessage = "Teléfono inválido")]
    public string Telefono { get; set; }
}
```

## 🚀 Guía Rápida de Despliegue
Configuración VMs:
```bash
# En todas las instancias:
sudo apt update && sudo apt install mysql-server -y
sudo mysql_secure_installation
```

Replicación MySQL:
```sql
-- En MASTER:
CREATE USER 'replicator'@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'%';

-- En SLAVES:
CHANGE MASTER TO
  MASTER_HOST='192.168.1.30',
  MASTER_USER='replicator',
  MASTER_PASSWORD='password',
  MASTER_LOG_FILE='mysql-bin.000004',
  MASTER_LOG_POS=4349;
START SLAVE;
```

```sql
# Ver estado replicación
SHOW SLAVE STATUS\G
# Ver procesos MySQL
SHOW PROCESSLIST;
```

## 🗃️ Base de Datos
Proveedor: MySQL
Host: Máquinas Virtuales Ubuntu (Infraestructura distribuida)
Configuración:

Cadena de conexión en appsettings.json

Configuración de replicación maestro-esclavo entre centros médicos
```bash
"ConnectionStrings": {
  "MySqlConnection": "server=192.168.1.30;port=3306;database=GestionHospitalaria;user=ubuntu;password=Ubuntu@123;"
}
```

Tablas principales:
CentrosMedicos
Especialidades
Medicos
Empleados
ConsultasMedicas

## ⚙️ Endpoints REST
Centros Médicos
GET /api/CentrosMedicos/Listar → Listar todos
GET /api/CentrosMedicos/Buscar/{id} → Buscar por ID
POST /api/CentrosMedicos/Crear → Crear nuevo
PUT /api/CentrosMedicos/Actualizar/{id} → Actualizar
DELETE /api/CentrosMedicos/Eliminar/{id} → Eliminar

Médicos
GET /api/Medico/Listar → Listar todos
POST /api/Medico/Crear → Crear nuevo
PUT /api/Medico/Actualizar/{id} → Actualizar
DELETE /api/Medico/Eliminar/{id} → Eliminar

Consultas Médicas
GET /api/ConsultaMedica/Listar → Listar todas
POST /api/ConsultaMedica/Crear → Crear nueva
PUT /api/ConsultaMedica/Actualizar/{id} → Actualizar
DELETE /api/ConsultaMedica/Eliminar/{id} → Eliminar
(Estructura similar para Empleados y Especialidades)

## 🖥️ Interfaz Web
Tecnologías: HTML, CSS, JavaScript
Estructura:
```bash
Interfaz_Funcional/
├── CSS/
├── HTML/
└── JAVASCRIPT/
```

Secciones:
Centros Médicos
Médicos
Consultas Médicas
Empleados
Especialidades

Características:
Diseño responsive con menú de navegación
Modales para formularios de CRUD
Validaciones de campos
Búsqueda en tiempo real

## ⚒️ Cómo Ejecutar
## 🔌 Requisitos
.NET Core SDK
MySQL Server
Máquinas virtuales Ubuntu (para configuración distribuida)
Visual Studio o VS Code

## 🚀 Pasos
Clonar repositorio
Configurar cadenas de conexión en appsettings.json
Ejecutar migraciones de Entity Framework:
```bash
dotnet ef database update
```

## 🚧 Estado del Proyecto
✅ Sistema completamente funcional
✅ Configuración distribuida implementada
✅ Documentación técnica completa

## 💡 Características Destacadas
Arquitectura MVC con separación clara de responsabilidades
API RESTful bien documentada con Swagger
Replicación de datos entre centros médicos (Quito, Guayaquil, Cuenca)
DTOs especializados para cada operación (Create/Read/Update)
Validaciones robustas en controladores

## 🌐 Infraestructura Distribuida
Configuración:
1 servidor maestro (Centro Médico Quito)
2 servidores esclavos (Guayaquil y Cuenca)
Replicación MySQL configurada mediante:
Archivos de configuración mysqld.cnf
Usuarios de replicación
Scripts SQL de inicialización

## 📊 Modelo de Datos
![deepseek_mermaid_20250423_6ad915](https://github.com/user-attachments/assets/2efd82f6-4d21-4410-9e76-597cf07445a3)

## 📌 Mejoras Futuras
Implementar autenticación JWT
Migrar frontend a Vue.js/React
Añadir módulo de historias clínicas
Implementar balanceo de carga entre centros
