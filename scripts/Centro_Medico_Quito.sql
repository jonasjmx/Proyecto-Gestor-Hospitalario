-- ##################################################################################################
-- CONFIGURACIÓN DEL SERVIDOR MAESTRO PARA REPLICACIÓN
-- Este script configura un servidor MySQL para replicación y crea la estructura de una base de datos
-- para un sistema de gestión hospitalaria. Incluye la creación de usuarios, tablas y datos de prueba.
-- ##################################################################################################

-- Configuración de la política de contraseñas
-- Cambia la política de contraseñas a un nivel bajo para facilitar la creación de usuarios.
SET GLOBAL validate_password.policy = LOW;

-- ##################################################################################################
-- CREACIÓN DE USUARIOS PARA REPLICACIÓN Y ACCESO
-- ##################################################################################################

-- Crear usuarios para las sucursales
-- Estos usuarios tendrán acceso a la base de datos desde direcciones IP específicas.
CREATE USER 'guayaquil'@'34.138.97.31' IDENTIFIED WITH mysql_native_password BY 'Centromedico@123';
CREATE USER 'cuenca'@'34.23.230.158' IDENTIFIED WITH mysql_native_password BY 'Centromedico@123';
CREATE USER 'latacunga'@'34.138.113.161' IDENTIFIED WITH mysql_native_password BY 'Centromedico@123';

CREATE USER 'doctor1'@'%' IDENTIFIED WITH mysql_native_password BY 'Centromedico@123';
GRANT ALL PRIVILEGES ON CentroMedicoDB.* TO 'doctor1'@'%';
FLUSH PRIVILEGES;

CREATE USER 'doctor2'@'%' IDENTIFIED WITH mysql_native_password BY 'Centromedico@123';
GRANT ALL PRIVILEGES ON CentroMedicoDB.* TO 'doctor2'@'%';
FLUSH PRIVILEGES;

-- Otorgar privilegios a los usuarios de las sucursales
-- Se otorgan todos los privilegios sobre la base de datos "GestionHospitalaria".
GRANT ALL PRIVILEGES ON GestionHospitalaria.* TO 'guayaquil'@'34.138.97.31';
GRANT ALL PRIVILEGES ON GestionHospitalaria.* TO 'cuenca'@'34.23.230.158';
GRANT ALL PRIVILEGES ON GestionHospitalaria.* TO 'latacunga'@'34.138.113.161';
FLUSH PRIVILEGES;

-- Eliminar usuarios (opcional, para limpieza)
DROP USER 'guayaquil'@'34.138.97.31';
DROP USER 'cuenca'@'34.23.230.158';
DROP USER 'latacunga'@'34.138.113.161';
FLUSH PRIVILEGES;

-- Crear usuario para replicación
-- Este usuario se utiliza para la replicación entre servidores MySQL.
CREATE USER 'replicator'@'%' IDENTIFIED WITH mysql_native_password BY 'Centromedico@123';

-- Otorgar privilegios de replicación al usuario replicator
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'%';
FLUSH PRIVILEGES;

-- Eliminar usuarios de replicación (opcional, para limpieza)
DROP USER 'replicator'@'%';
FLUSH PRIVILEGES;

-- Crear usuarios de replicación con IP específicas
CREATE USER 'replicator'@'34.138.97.31' IDENTIFIED WITH mysql_native_password BY 'Centromedico@123';
CREATE USER 'replicator'@'34.23.230.158' IDENTIFIED WITH mysql_native_password BY 'Centromedico@123';
CREATE USER 'replicator'@'34.138.113.161' IDENTIFIED WITH mysql_native_password BY 'Centromedico@123';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'34.138.97.31';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'34.23.230.158';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'34.138.113.161';
FLUSH PRIVILEGES;

-- Eliminar usuarios de replicación con IP específicas (opcional)
DROP USER 'replicator'@'34.138.97.31';
DROP USER 'replicator'@'34.23.230.158';
DROP USER 'replicator'@'34.138.113.161';
FLUSH PRIVILEGES;

-- ##################################################################################################
-- VERIFICACIONES IMPORTANTES
-- ##################################################################################################

-- Verificar si el log binario está habilitado (necesario para replicación)
SHOW VARIABLES LIKE 'log_bin';

-- Verificar si SSL está habilitado (para conexiones seguras)
SHOW VARIABLES LIKE '%ssl%';

-- Verificar el plugin de autenticación utilizado por el servidor
INSTALL PLUGIN mysql_native_password SONAME 'auth_native_password.so';

-- Cambiar el plugin de autenticación del usuario replicator
ALTER USER 'replicator'@'%' IDENTIFIED WITH mysql_native_password BY 'Centromedico@123';
ALTER USER 'replicator'@'34.138.97.31' IDENTIFIED WITH mysql_native_password BY 'Centromedico@123';
ALTER USER 'replicator'@'34.23.230.158' IDENTIFIED WITH mysql_native_password BY 'Centromedico@123';
ALTER USER 'replicator'@'34.138.113.161' IDENTIFIED WITH mysql_native_password BY 'Centromedico@123';
FLUSH PRIVILEGES;

-- Verificar el UUID del servidor (debe ser único para replicación)
SHOW VARIABLES LIKE 'server_uuid';

-- Verificar el plugin de autenticación del usuario replicator
SELECT User, Host, plugin FROM mysql.user WHERE User = 'replicator';

-- Mostrar los privilegios del usuario replicator
SHOW GRANTS FOR 'replicator'@'%';

-- Verificar las bases de datos configuradas para replicación
SHOW VARIABLES LIKE 'binlog_do_db';

-- Mostrar eventos del log binario (opcional para depuración)
SHOW BINLOG EVENTS IN 'mysql-bin.000004' FROM 569 LIMIT 10;

-- Bloquear y desbloquear tablas (para sincronización)
FLUSH TABLES WITH READ LOCK;
UNLOCK TABLES;

-- Desbloquear IPs bloqueadas (importante en caso de errores de conexión)
FLUSH HOSTS;

-- Mostrar todos los usuarios configurados en el servidor
SELECT User, Host FROM mysql.user;

-- ##################################################################################################
-- VERIFICACIONES FINALES
-- ##################################################################################################

-- Mostrar la versión del servidor MySQL
SELECT @@version;

-- Mostrar el estado del maestro para replicación
SHOW MASTER STATUS;

-- Nota: Si los valores cambian después de un reinicio, actualice los esclavos.

CHANGE REPLICATION SOURCE TO
SOURCE_HOST='ip_source',
SOURCE_USER='replicator',
SOURCE_PASSWORD='password_seguro',
MASTER_AUTO_POSITION = 1;

-- ##################################################################################################
-- CONFIGURACIÓN DE LA BASE DE DATOS
-- ##################################################################################################

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS GestionHospitalaria;
USE GestionHospitalaria;

-- Crear tabla CentrosMedicos
-- Almacena información sobre los centros médicos.
CREATE TABLE CentroMedico (
    CentroID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Direccion VARCHAR(50) NOT NULL,
    Telefono VARCHAR(10),
    Email VARCHAR(100) UNIQUE
);

-- Crear tabla Usuarios
-- Almacena información sobre los usuarios del sistema, incluyendo su rol y credenciales.
CREATE TABLE Usuario (
    UsuarioID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Sexo ENUM('MASCULINO', 'FEMENINO') NOT NULL,
    FechaNacimiento DATE NOT NULL,
    Direccion VARCHAR(100) NOT NULL,
    Telefono VARCHAR(15),
    Email VARCHAR(100) UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Rol ENUM('ADMIN', 'MEDICO', 'EMPLEADO') NOT NULL
);

-- Crear tabla Especialidades
-- Almacena las especialidades médicas disponibles.
CREATE TABLE Especialidad (
    EspecialidadID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL
);

-- Crear tabla Medicos
-- Almacena información sobre los médicos, incluyendo su especialidad y centro médico asociado.
CREATE TABLE Medico (
    MedicoID INT AUTO_INCREMENT PRIMARY KEY,
    EspecialidadID INT NOT NULL,
    CentroID INT NOT NULL,
    UsuarioID INT NOT NULL,
    FOREIGN KEY (EspecialidadID) REFERENCES Especialidad(EspecialidadID),
    FOREIGN KEY (CentroID) REFERENCES CentroMedico(CentroID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuario(UsuarioID)
);

-- Crear tabla Empleados
-- Almacena información sobre los empleados de los centros médicos.
CREATE TABLE Empleado (
    EmpleadoID INT AUTO_INCREMENT PRIMARY KEY,
    Cargo VARCHAR(50) NOT NULL,
    UsuarioID INT NOT NULL,
    CentroID INT NOT NULL,
    FOREIGN KEY (CentroID) REFERENCES CentroMedico(CentroID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuario(UsuarioID)
);

-- Crear tabla Pacientes
-- Almacena información sobre los pacientes atendidos en los centros médicos.
CREATE TABLE Paciente (
    PacienteID INT AUTO_INCREMENT PRIMARY KEY,
    UsuarioID INT NOT NULL,
    CentroID INT NOT NULL,
    FechaRegistro DATE NOT NULL,
    FOREIGN KEY (UsuarioID) REFERENCES Usuario(UsuarioID)
);

-- Crear tabla Consultas
-- Almacena información sobre las consultas médicas realizadas, incluyendo el médico y el paciente.
CREATE TABLE Consulta (
    ConsultaID INT AUTO_INCREMENT PRIMARY KEY,
    MedicoID INT NOT NULL,
    PacienteID INT NOT NULL,
    FechaConsulta DATE NOT NULL,
    Diagnostico TEXT,
    Receta TEXT,
    FOREIGN KEY (MedicoID) REFERENCES Medico(MedicoID),
    FOREIGN KEY (PacienteID) REFERENCES Paciente(PacienteID)
);

-- ##################################################################################################
-- INSERTAR DATOS DE PRUEBA
-- ##################################################################################################

-- Insertar datos en la tabla CentrosMedicos
INSERT INTO CentroMedico (Nombre, Direccion, Telefono, Email)
VALUES 
('Centro Médico Quito', 'Av. Amazonas 123', '022345678', 'quito@centromedico.com'),
('Centro Médico Guayaquil', 'Malecón 2000', '042345678', 'guayaquil@centromedico.com'),
('Centro Médico Cuenca', 'Av. Solano 456', '072345678', 'cuenca@centromedico.com'),
('Centro Médico Latacunga', 'Calle Sucre 789', '032345678', 'latacunga@centromedico.com');

-- Insertar datos en la tabla Usuarios
INSERT INTO Usuario (Nombre, Apellido, Sexo, FechaNacimiento, Direccion, Telefono, Email, Password, Rol)
VALUES 
('Juan', 'Perez', 'MASCULINO', '1985-05-15', 'Calle 1', '0991234567', 'juan.perez@example.com', 'password123', 'ADMIN'),
('Maria', 'Gomez', 'FEMENINO', '1990-08-20', 'Calle 2', '0997654321', 'maria.gomez@example.com', 'password456', 'MEDICO'),
('Carlos', 'Lopez', 'MASCULINO', '1980-03-10', 'Calle 3', '0991122334', 'carlos.lopez@example.com', 'password789', 'EMPLEADO');
commit;

INSERT INTO Usuario (Nombre, Apellido, Sexo, FechaNacimiento, Direccion, Telefono, Email, Password, Rol)
VALUES 
('Maria1', 'Gomez1', 'FEMENINO', '1990-08-20', 'Calle 2', '0997654321', 'maria1.gomez1@example.com', 'password456', 'MEDICO');

-- Insertar datos en la tabla Especialidades
INSERT INTO Especialidad (Nombre)
VALUES 
('Cardiología'),
('Pediatría'),
('Dermatología');

-- Insertar datos en la tabla Medicos
INSERT INTO Medico (EspecialidadID, CentroID, UsuarioID)
VALUES 
(1, 1, 2),
(2, 2, 2),
(3, 3, 2);

-- Insertar datos en la tabla Empleados
INSERT INTO Empleado (Cargo, UsuarioID, CentroID)
VALUES 
('Recepcionista', 3, 1),
('Enfermero', 3, 2),
('Administrador', 3, 3);

-- Insertar datos en la tabla Pacientes
INSERT INTO Paciente (UsuarioID, CentroID, FechaRegistro)
VALUES 
(1, 1, '2023-01-01'),
(2, 2, '2023-02-01'),
(3, 3, '2023-03-01');

-- Insertar datos en la tabla Consultas
INSERT INTO Consulta (MedicoID, PacienteID, FechaConsulta, Diagnostico, Receta)
VALUES 
(1, 1, '2023-01-15', 'Chequeo general', 'Paracetamol 500mg'),
(2, 2, '2023-02-15', 'Consulta pediátrica', 'Ibuprofeno 200mg'),
(3, 3, '2023-03-15', 'Consulta dermatológica', 'Crema hidratante');

-- ##################################################################################################
-- CREACIÓN DE LA BASE DE DATOS PARA EL CENTRO MÉDICO
-- ##################################################################################################

CREATE DATABASE IF NOT EXISTS CentroMedicoDB;
USE CentroMedicoDB;

-- Tabla de centros médicos
CREATE TABLE CentrosMedicos (
    CentroID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Ciudad VARCHAR(100) NOT NULL,
    Direccion VARCHAR(200),
    Telefono VARCHAR(20)
);

-- Tabla de especialidades
CREATE TABLE Especialidades (
    EspecialidadID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(255)
);

-- Tabla de usuarios para inicio de sesión
CREATE TABLE UsuariosCentro (
    UsuarioID INT AUTO_INCREMENT PRIMARY KEY,
    CentroID INT NOT NULL,
    Email VARCHAR(75) NOT NULL UNIQUE,
    Contrasena VARCHAR(75) NOT NULL,
    FOREIGN KEY (CentroID) REFERENCES CentrosMedicos(CentroID)
);

-- Tabla de médicos
CREATE TABLE Medicos (
    MedicoID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    EspecialidadID INT NOT NULL,
    CentroID INT NOT NULL,
    Email VARCHAR(100),
    Telefono VARCHAR(20),
    FOREIGN KEY (EspecialidadID) REFERENCES Especialidades(EspecialidadID),
    FOREIGN KEY (CentroID) REFERENCES CentrosMedicos(CentroID)
);

-- Tabla de asignación de especialidades
CREATE TABLE AsignacionEspecialidades (
    AsignacionID INT AUTO_INCREMENT PRIMARY KEY,
    MedicoID INT NOT NULL,
    EspecialidadID INT NOT NULL,
    FOREIGN KEY (MedicoID) REFERENCES Medicos(MedicoID),
    FOREIGN KEY (EspecialidadID) REFERENCES Especialidades(EspecialidadID)
);

-- Tabla de empleados
CREATE TABLE Empleados (
    EmpleadoID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Cargo VARCHAR(100),
    Email VARCHAR(100),
    Telefono VARCHAR(20)
);

-- Tabla de clientes
CREATE TABLE Clientes (
    ClienteID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Correo VARCHAR(100),
    Telefono VARCHAR(20)
);

-- Tabla de consultas
CREATE TABLE Consultas (
    ConsultaID INT AUTO_INCREMENT PRIMARY KEY,
    MedicoID INT NOT NULL,
    ClienteID INT NOT NULL,
    FechaConsulta DATETIME NOT NULL,
    Diagnostico VARCHAR(255),
    Tratamiento VARCHAR(255),
    FOREIGN KEY (MedicoID) REFERENCES Medicos(MedicoID),
    FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID)
);

-- Insertar datos de prueba

INSERT INTO CentrosMedicos (Nombre, Ciudad, Direccion, Telefono) VALUES
('Centro Médico Quito', 'Quito', 'Av. Amazonas 123', '022345678'),
('Centro Médico Guayaquil', 'Guayaquil', 'Malecón 2000', '042345678'),
('Centro Médico Cuenca', 'Cuenca', 'Av. Solano 456', '072345678');

INSERT INTO Especialidades (Nombre, Descripcion) VALUES
('Cardiología', 'Especialidad en enfermedades del corazón'),
('Pediatría', 'Especialidad en atención infantil'),
('Dermatología', 'Especialidad en enfermedades de la piel');
commit;

INSERT INTO UsuariosCentro (CentroID, Email, Contrasena) VALUES
(1, 'admin@norte.com', 'admin123'),
(2, 'admin@sur.com', 'admin456'),
(3, 'admin@este.com', 'admin789');

INSERT INTO Medicos (Nombre, Apellido, EspecialidadID, CentroID, Email, Telefono) VALUES
('Juan', 'Pérez', 1, 1, 'juan.perez@medico.com', '0991111111'),
('María', 'Gómez', 2, 2, 'maria.gomez@medico.com', '0992222222'),
('Carlos', 'Lopez', 3, 3, 'carlos.lopez@medico.com', '0993333333');

INSERT INTO AsignacionEspecialidades (MedicoID, EspecialidadID) VALUES
(1, 1),
(2, 2),
(3, 3);

INSERT INTO Empleados (Nombre, Apellido, Cargo, Email, Telefono) VALUES
('Ana', 'Martínez', 'Recepcionista', 'ana.martinez@empleado.com', '0981111111'),
('Luis', 'Ramírez', 'Enfermero', 'luis.ramirez@empleado.com', '0982222222'),
('Sofía', 'Vega', 'Administrador', 'sofia.vega@empleado.com', '0983333333');

INSERT INTO Clientes (Nombre, Apellido, Correo, Telefono) VALUES
('Pedro', 'Alvarez', 'pedro.alvarez@cliente.com', '0971111111'),
('Lucía', 'Mora', 'lucia.mora@cliente.com', '0972222222'),
('Miguel', 'Salas', 'miguel.salas@cliente.com', '0973333333');

INSERT INTO Consultas (MedicoID, ClienteID, FechaConsulta, Diagnostico, Tratamiento) VALUES
(1, 1, '2024-06-08 09:00:00', 'Chequeo general', 'Paracetamol 500mg'),
(2, 2, '2024-06-08 10:00:00', 'Consulta pediátrica', 'Ibuprofeno 200mg'),
(3, 3, '2024-06-08 11:00:00', 'Consulta dermatológica', 'Crema hidratante');