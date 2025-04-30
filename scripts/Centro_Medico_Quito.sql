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
    Nombre VARCHAR(100) NOT NULL,
    Direccion VARCHAR(255) NOT NULL,
    Telefono VARCHAR(15),
    Email VARCHAR(100)
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
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Telefono VARCHAR(15),
    Email VARCHAR(100),
    EspecialidadID INT NOT NULL,
    CentroID INT NOT NULL,
    FOREIGN KEY (EspecialidadID) REFERENCES Especialidades(EspecialidadID),
    FOREIGN KEY (CentroID) REFERENCES CentrosMedicos(CentroID)
);

-- Crear tabla Empleados
-- Almacena información sobre los empleados de los centros médicos.
CREATE TABLE Empleados (
    EmpleadoID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Cargo VARCHAR(100),
    Telefono VARCHAR(15),
    Email VARCHAR(100),
    CentroID INT NOT NULL,
    FOREIGN KEY (CentroID) REFERENCES CentrosMedicos(CentroID)
);

-- Crear tabla ConsultasMedicas
-- Almacena información sobre las consultas médicas realizadas.
CREATE TABLE ConsultasMedicas (
    ConsultaID INT AUTO_INCREMENT PRIMARY KEY,
    Fecha DATE NOT NULL,
    Hora TIME NOT NULL,
    PacienteNombre VARCHAR(100) NOT NULL,
    PacienteApellido VARCHAR(100) NOT NULL,
    Ubicacion ENUM('QUITO', 'GUAYAQUIL', 'CUENCA') NOT NULL,
    MedicoID INT NOT NULL,
    CentroID INT NOT NULL,
    FOREIGN KEY (MedicoID) REFERENCES Medicos(MedicoID),
    FOREIGN KEY (CentroID) REFERENCES CentrosMedicos(CentroID)
);

-- ##################################################################################################
-- INSERTAR DATOS DE PRUEBA
-- ##################################################################################################

-- Insertar datos en CentrosMedicos
-- Datos de prueba para los centros médicos.
INSERT INTO CentrosMedicos (Nombre, Direccion, Telefono, Email)
VALUES 
('Hospital Central', 'Av. Principal 123, Ciudad', '123456789', 'contacto@hospitalcentral.com'),
('Clínica San José', 'Calle Secundaria 45, Ciudad', '987654321', 'info@clinicasanjose.com'),
('Centro Médico Norte', 'Av. Norte 67, Ciudad', '456789123', 'contacto@centromediconorte.com');

-- Insertar datos en Especialidades
-- Datos de prueba para las especialidades médicas.
INSERT INTO Especialidades (Nombre)
VALUES 
('Cardiología'),
('Pediatría'),
('Dermatología');

-- Insertar datos en Medicos
-- Datos de prueba para los médicos.
INSERT INTO Medicos (Nombre, Apellido, Telefono, Email, EspecialidadID, CentroID)
VALUES 
('Juan', 'Pérez', '111222333', 'juan.perez@hospital.com', 1, 1),
('María', 'Gómez', '444555666', 'maria.gomez@hospital.com', 2, 2),
('Carlos', 'López', '777888999', 'carlos.lopez@hospital.com', 3, 3);

-- Insertar datos en Empleados
-- Datos de prueba para los empleados.
INSERT INTO Empleados (Nombre, Apellido, Cargo, Telefono, Email, CentroID)
VALUES 
('Ana', 'Martínez', 'Recepcionista', '123123123', 'ana.martinez@hospital.com', 1),
('Luis', 'Hernández', 'Administrador', '321321321', 'luis.hernandez@hospital.com', 2),
('Sofía', 'Ramírez', 'Enfermera', '456456456', 'sofia.ramirez@hospital.com', 3);

-- ##################################################################################################
-- VERIFICACIONES FINALES
-- ##################################################################################################

-- Mostrar la versión del servidor MySQL
SELECT @@version;

-- Mostrar el estado del maestro para replicación
SHOW MASTER STATUS;

-- Nota: Si los valores cambian después de un reinicio, actualice los esclavos.