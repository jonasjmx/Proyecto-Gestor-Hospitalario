# Proyecto Gestor Hospitalario

## 📚 SGM - Sistema de Centros Médicos
Este proyecto es un sistema de gestión hospitalaria distribuido, compuesto por una API RESTful desarrollada en ASP.NET Core, conectada a una base de datos MySQL en máquinas virtuales con Ubuntu Server 24. Incluye una interfaz web básica (HTML + JavaScript) para gestionar empleados, médicos, consultas médicas y especialidades.

---

## 🏥 Sistema de Gestión Hospitalaria Distribuido

### 🧰 Tecnologías Utilizadas
| Componente       | Tecnología                                                                 |
|-------------------|---------------------------------------------------------------------------|
| **Backend**       | ASP.NET Core 7, Entity Framework Core, Swagger/OpenAPI                   |
| **Base de Datos** | MySQL 8.0 (Configuración distribuida Maestro-Esclavo)                    |
| **Frontend**      | HTML5, CSS3, JavaScript (Vanilla)                                        |
| **Infraestructura** | 3 VMs Ubuntu Server 24.04 (VirtualBox)                                 |
| **Seguridad**     | CORS Policies, Validaciones en capa de controlador                       |
| **DevOps**        | Configuración manual de replicación MySQL                                |

---

## 📂 Estructura del Proyecto
```plaintext
Gestor_Hospitalario/
├── 📁 Context/
│   └── HospitalContext.cs           # Configuración EF Core y DbSets
├── 📁 Controllers/
│   ├── CentrosMedicosController.cs  # CRUD completo
│   ├── ConsultaMedicaController.cs  # Validación de horarios
│   ├── EmpleadoController.cs        # Gestión de personal administrativo
│   ├── EspecialidadesController.cs  # CRUD básico
│   └── MedicoController.cs          # Relación con especialidades
├── 📁 DTOs/
│   ├── CentroMedico/                # Separación por entidad
│   │   ├── CreateDTO.cs             # Validaciones Required
│   │   ├── ReadDTO.cs               # Proyecciones seguras
│   │   └── UpdateDTO.cs             
│   ├── ConsultaMedica/              # DTOs para consultas
│   └── ...                          # Similar estructura para otras entidades
├── 📁 Models/
│   ├── CentroMedico.cs              # Modelo principal
│   ├── ConsultaMedica.cs            # Con relaciones
│   ├── Empleado.cs                  
│   ├── Especialidad.cs              
│   └── Medico.cs                    # Relación N:1 con Especialidad
├── 📁 Migrations/                    # Historial de migraciones EF
├── 📁 wwwroot/
│   ├── 📁 css/                       # Styles.css + Normalize
│   ├── 📁 js/                        # Archivos modularizados
│   │   ├── main.js                  # Lógica principal
│   │   └── entidades/               # JS por módulo
│   └── index.html                   # Interfaz única con tabs
├── appsettings.json                 # Cadenas de conexión
├── Program.cs                       # Configuración CORS y Swagger
└── Infraestructura.md               # Guía de configuración VMs
```

---

## 🗃️ Diagrama de Base de Datos
![Diagrama de Base de Datos](https://github.com/user-attachments/assets/6a493428-6c5f-48af-bb8e-cbc543b173b8)

---

## 🔄 Diagrama de Flujo - Creación de Consulta Médica
![Diagrama de Flujo](https://github.com/user-attachments/assets/095933bd-b3b3-4004-9d2e-31570ffd28de)

---

## 📊 Modelo de Datos
![deepseek_mermaid_20250423_6ad915](https://github.com/user-attachments/assets/2efd82f6-4d21-4410-9e76-597cf07445a3)

---

## 📊 Estructura de la API REST
```json
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

---

## 🖥️ Diagrama de Componentes
```plaintext
+-------------+       +-------------+       +-------------------+
|  Frontend   |       |  Backend    |       |  Infraestructura  |
+-------------+       +-------------+       +-------------------+
| [Interfaz   | HTTP/ | [Controla-  |       |    [VM Master]    |
|  Web]       | REST  |  dores]     |       |        |          |
| [API Fetch] |       | [Servicios] | BD    | [MySQL Primary]   |
|             |       | [Repositorio]|       |    [VM Slave 1]   |
|             |       | [MySQL]     |       | [MySQL Replica]   |
+-------------+       +-------------+       +-------------------+
```

---

## 🔐 Políticas de Seguridad Implementadas
### Configuración CORS (Program.cs):
```csharp
builder.Services.AddCors(options => {
        options.AddPolicy("AllowAll", policy => 
                policy.AllowAnyOrigin()
                            .AllowAnyMethod()
                            .AllowAnyHeader());
});
```

### Validaciones en DTOs:
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

---

## 🚀 Guía Rápida de Configuración
- Configuración VMs:
```bash
# En todas las instancias:
sudo apt update && sudo apt install mysql-server -y
sudo mysql_secure_installation
```
- Replicación MySQL:
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
- Host: Máquinas Virtuales Ubuntu (Infraestructura distribuida)
- Configuración:

- Cadena de conexión en appsettings.json

- Configuración de replicación maestro-esclavo entre centros médicos
```bash
"ConnectionStrings": {
  "MySqlConnection": "server=192.168.1.30;port=3306;database=GestionHospitalaria;user=ubuntu;password=Ubuntu@123;"
}
```

Tablas principales:
- CentrosMedicos
- Especialidades
- Medicos
- Empleados
- ConsultasMedicas
---
## ⚙️ Endpoints REST
Centros Médicos
- GET /api/CentrosMedicos/Listar → Listar todos
- GET /api/CentrosMedicos/Buscar/{id} → Buscar por ID
- POST /api/CentrosMedicos/Crear → Crear nuevo
- PUT /api/CentrosMedicos/Actualizar/{id} → Actualizar
- DELETE /api/CentrosMedicos/Eliminar/{id} → Eliminar
---
Médicos
- GET /api/Medico/Listar → Listar todos
- POST /api/Medico/Crear → Crear nuevo
- PUT /api/Medico/Actualizar/{id} → Actualizar
- DELETE /api/Medico/Eliminar/{id} → Eliminar
---
Consultas Médicas
- GET /api/ConsultaMedica/Listar → Listar todas
- POST /api/ConsultaMedica/Crear → Crear nueva
- PUT /api/ConsultaMedica/Actualizar/{id} → Actualizar
- DELETE /api/ConsultaMedica/Eliminar/{id} → Eliminar
---
## 🖥️ Interfaz Web
- Tecnologías: HTML, CSS, JavaScript
- Estructura:
```bash
Interfaz_Funcional/
├── CSS/
├── HTML/
└── JAVASCRIPT/
```

Secciones:
- Centros Médicos
- Médicos
- Consultas Médicas
- Empleados
- Especialidades
---
Características:
- Diseño responsive con menú de navegación
- Modales para formularios de CRUD
- Validaciones de campos
- Búsqueda en tiempo real

## 🚧 Estado del Proyecto
- ✅ Sistema completamente funcional.
- ✅ Configuración distribuida implementada.
- ✅ Documentación técnica completa.

---

## 💡 Características Destacadas
- Arquitectura MVC con separación clara de responsabilidades.
- API RESTful documentada con Swagger.
- Replicación de datos entre centros médicos (Quito, Guayaquil, Cuenca).
- DTOs especializados para cada operación (Create/Read/Update).
- Validaciones robustas en controladores.

---

## 📌 Mejoras Futuras
- Implementar autenticación JWT.
- Migrar frontend a Vue.js/React.
- Añadir módulo de historias clínicas.
<<<<<<< HEAD
- Implementar balanceo de carga entre centros.
=======
- Implementar balanceo de carga entre centros.








>>>>>>> 7c2b6ba3e870ce4484c783f03fd03c69f952e9f1
