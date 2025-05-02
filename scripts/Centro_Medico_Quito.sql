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
CREATE USER 'guayaquil'@'192.168.1.20' IDENTIFIED BY 'qweQWE!@#';
CREATE USER 'cuenca'@'192.168.1.47' IDENTIFIED BY 'qweQWE!@#';

-- Otorgar privilegios a los usuarios de las sucursales
-- Se otorgan todos los privilegios sobre la base de datos "GestionHospitalaria".
GRANT ALL PRIVILEGES ON GestionHospitalaria.* TO 'guayaquil'@'192.168.1.20';
GRANT ALL PRIVILEGES ON GestionHospitalaria.* TO 'cuenca'@'192.168.1.47';
FLUSH PRIVILEGES;

-- Eliminar usuarios (opcional, para limpieza)
DROP USER 'guayaquil'@'192.168.1.20';
DROP USER 'cuenca'@'192.168.1.47';
FLUSH PRIVILEGES;

-- Crear usuario para replicación
-- Este usuario se utiliza para la replicación entre servidores MySQL.
CREATE USER 'replicator'@'%' IDENTIFIED BY 'qweQWE!@#';

-- Otorgar privilegios de replicación al usuario replicator
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'%';
FLUSH PRIVILEGES;

-- Eliminar usuarios de replicación (opcional, para limpieza)
DROP USER 'replicator'@'%';
FLUSH PRIVILEGES;

-- Crear usuarios de replicación con IP específicas
CREATE USER 'replicator'@'192.168.1.20' IDENTIFIED WITH mysql_native_password BY 'qweQWE!@#';
CREATE USER 'replicator'@'192.168.1.47' IDENTIFIED WITH mysql_native_password BY 'qweQWE!@#';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'192.168.1.20';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'192.168.1.47';
FLUSH PRIVILEGES;

-- Eliminar usuarios de replicación con IP específicas (opcional)
DROP USER 'replicator'@'10.79.22.102';
DROP USER 'replicator'@'10.79.22.85';
FLUSH PRIVILEGES;

-- ##################################################################################################
-- VERIFICACIONES IMPORTANTES
-- ##################################################################################################

-- Verificar si el log binario está habilitado (necesario para replicación)
SHOW VARIABLES LIKE 'log_bin';

-- Verificar si SSL está habilitado (para conexiones seguras)
SHOW VARIABLES LIKE '%ssl%';

-- Cambiar el plugin de autenticación del usuario replicator
ALTER USER 'replicator'@'%' IDENTIFIED WITH mysql_native_password BY 'qweQWE!@#';
ALTER USER 'replicator'@'10.79.22.102' IDENTIFIED WITH mysql_native_password BY 'qweQWE!@#';
ALTER USER 'replicator'@'10.79.22.85' IDENTIFIED WITH mysql_native_password BY 'qweQWE!@#';
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
-- CONFIGURACIÓN DE LA BASE DE DATOS
-- ##################################################################################################

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS GestionHospitalaria;
USE GestionHospitalaria;

-- Crear tabla CentrosMedicos
-- Almacena información sobre los centros médicos.
CREATE TABLE CentrosMedicos (
    CentroID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Direccion VARCHAR(50) NOT NULL,
    Telefono VARCHAR(10),
    Email VARCHAR(100) UNIQUE
);

-- Crear tabla Usuarios
-- Almacena información sobre los usuarios del sistema, incluyendo su rol y credenciales.
CREATE TABLE Usuarios (
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
CREATE TABLE Especialidades (
    EspecialidadID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL
);

-- Crear tabla Medicos
-- Almacena información sobre los médicos, incluyendo su especialidad y centro médico asociado.
CREATE TABLE Medicos (
    MedicoID INT AUTO_INCREMENT PRIMARY KEY,
    EspecialidadID INT NOT NULL,
    CentroID INT NOT NULL,
    UsuarioID INT NOT NULL,
    FOREIGN KEY (EspecialidadID) REFERENCES Especialidades(EspecialidadID),
    FOREIGN KEY (CentroID) REFERENCES CentrosMedicos(CentroID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
);

-- Crear tabla Empleados
-- Almacena información sobre los empleados de los centros médicos.
CREATE TABLE Empleados (
    EmpleadoID INT AUTO_INCREMENT PRIMARY KEY,
    Cargo VARCHAR(50) NOT NULL,
    UsuarioID INT NOT NULL,
    CentroID INT NOT NULL,
    FOREIGN KEY (CentroID) REFERENCES CentrosMedicos(CentroID)
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
);

-- Crear tabla Pacientes
-- Almacena información sobre los pacientes atendidos en los centros médicos.
CREATE TABLE Pacientes (
    PacienteID INT AUTO_INCREMENT PRIMARY KEY,
    UsuarioID INT NOT NULL,
    CentroID INT NOT NULL,
    FechaRegistro DATE NOT NULL,
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
);

-- Crear tabla Consultas
-- Almacena información sobre las consultas médicas realizadas, incluyendo el médico y el paciente.
CREATE TABLE Consultas (
    ConsultaID INT AUTO_INCREMENT PRIMARY KEY,
    MedicoID INT NOT NULL,
    PacienteID INT NOT NULL,
    FechaConsulta DATE NOT NULL,
    Diagnostico TEXT,
    Receta TEXT,
    FOREIGN KEY (MedicoID) REFERENCES Medicos(MedicoID),
    FOREIGN KEY (PacienteID) REFERENCES Pacientes(PacienteID)
);

-- ##################################################################################################
-- INSERTAR DATOS DE PRUEBA
-- ##################################################################################################

-- Insertar datos en la tabla CentrosMedicos
INSERT INTO CentrosMedicos (Nombre, Direccion, Telefono, Email)
VALUES 
('Centro Médico Quito', 'Av. Amazonas 123', '022345678', 'quito@centromedico.com'),
('Centro Médico Guayaquil', 'Malecón 2000', '042345678', 'guayaquil@centromedico.com'),
('Centro Médico Cuenca', 'Av. Solano 456', '072345678', 'cuenca@centromedico.com'),
('Centro Médico Latacunga', 'Calle Sucre 789', '032345678', 'latacunga@centromedico.com');

-- Insertar datos en la tabla Usuarios
INSERT INTO Usuarios (Nombre, Apellido, Sexo, FechaNacimiento, Direccion, Telefono, Email, Password, Rol)
VALUES 
('Juan', 'Perez', 'MASCULINO', '1985-05-15', 'Calle 1', '0991234567', 'juan.perez@example.com', 'password123', 'ADMIN'),
('Maria', 'Gomez', 'FEMENINO', '1990-08-20', 'Calle 2', '0997654321', 'maria.gomez@example.com', 'password456', 'MEDICO'),
('Carlos', 'Lopez', 'MASCULINO', '1980-03-10', 'Calle 3', '0991122334', 'carlos.lopez@example.com', 'password789', 'EMPLEADO');

-- Insertar datos en la tabla Especialidades
INSERT INTO Especialidades (Nombre)
VALUES 
('Cardiología'),
('Pediatría'),
('Dermatología');

-- Insertar datos en la tabla Medicos
INSERT INTO Medicos (EspecialidadID, CentroID, UsuarioID)
VALUES 
(1, 1, 2),
(2, 2, 2),
(3, 3, 2);

-- Insertar datos en la tabla Empleados
INSERT INTO Empleados (Cargo, UsuarioID, CentroID)
VALUES 
('Recepcionista', 3, 1),
('Enfermero', 3, 2),
('Administrador', 3, 3);

-- Insertar datos en la tabla Pacientes
INSERT INTO Pacientes (UsuarioID, CentroID, FechaRegistro)
VALUES 
(1, 1, '2023-01-01'),
(2, 2, '2023-02-01'),
(3, 3, '2023-03-01');

-- Insertar datos en la tabla Consultas
INSERT INTO Consultas (MedicoID, PacienteID, FechaConsulta, Diagnostico, Receta)
VALUES 
(1, 1, '2023-01-15', 'Chequeo general', 'Paracetamol 500mg'),
(2, 2, '2023-02-15', 'Consulta pediátrica', 'Ibuprofeno 200mg'),
(3, 3, '2023-03-15', 'Consulta dermatológica', 'Crema hidratante');

-- ##################################################################################################
-- VERIFICACIONES FINALES
-- ##################################################################################################

-- Mostrar la versión del servidor MySQL
SELECT @@version;

-- Mostrar el estado del maestro para replicación
SHOW MASTER STATUS;

-- Nota: Si los valores cambian después de un reinicio, actualice los esclavos.