Create Database CentroMedicoDB;
-- Seleccionar la base de datos
USE `CentroMedicoDB`;

-- Primero crear las tablas sin dependencias (que son referenciadas por otras)
-- Tabla de centros médicos (debe ir primero porque es referenciada por UsuariosCentro y Medicos)
CREATE TABLE IF NOT EXISTS CentrosMedicos (
    CentroID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    Ciudad VARCHAR(100) NOT NULL,
    Direccion VARCHAR(200),
    Telefono VARCHAR(20)
) ENGINE=InnoDB;

-- Tabla de especialidades (referenciada por Medicos y AsignacionEspecialidades)
CREATE TABLE IF NOT EXISTS Especialidades (
    EspecialidadID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(255)
) ENGINE=InnoDB;

-- Tabla de médicos (referenciada por AsignacionEspecialidades y Consultas)
CREATE TABLE IF NOT EXISTS Medicos (
    MedicoID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    EspecialidadID INT NOT NULL,
    CentroID INT NOT NULL,
    Email VARCHAR(100),
    Telefono VARCHAR(20),
    FOREIGN KEY (EspecialidadID) REFERENCES Especialidades(EspecialidadID),
    FOREIGN KEY (CentroID) REFERENCES CentrosMedicos(CentroID)
) ENGINE=InnoDB;

-- Tabla de usuarios para inicio de sesión (depende de CentrosMedicos)
CREATE TABLE IF NOT EXISTS UsuariosCentro (
    UsuarioID INT PRIMARY KEY AUTO_INCREMENT,
    CentroID INT NOT NULL,
    Email VARCHAR(75) NOT NULL UNIQUE,
    Contrasena VARCHAR(75) NOT NULL,
    FOREIGN KEY (CentroID) REFERENCES CentrosMedicos(CentroID)
) ENGINE=InnoDB;

-- Tabla de asignación de especialidades (depende de Medicos y Especialidades)
CREATE TABLE IF NOT EXISTS AsignacionEspecialidades (
    AsignacionID INT PRIMARY KEY AUTO_INCREMENT,
    MedicoID INT NOT NULL,
    EspecialidadID INT NOT NULL,
    FOREIGN KEY (MedicoID) REFERENCES Medicos(MedicoID),
    FOREIGN KEY (EspecialidadID) REFERENCES Especialidades(EspecialidadID),
    UNIQUE KEY (MedicoID, EspecialidadID)  -- Evita duplicados
) ENGINE=InnoDB;

-- Tabla de empleados (sin dependencias)
CREATE TABLE IF NOT EXISTS Empleados (
    EmpleadoID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Cargo VARCHAR(100),
    Email VARCHAR(100),
    Telefono VARCHAR(20)
) ENGINE=InnoDB;

-- Tabla de clientes (referenciada por Consultas)
CREATE TABLE IF NOT EXISTS Clientes (
    ClienteID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Correo VARCHAR(100),
    Telefono VARCHAR(20)
) ENGINE=InnoDB;

-- Tabla de consultas (depende de Medicos y Clientes)
CREATE TABLE IF NOT EXISTS Consultas (
    ConsultaID INT PRIMARY KEY AUTO_INCREMENT,
    MedicoID INT NOT NULL,
    ClienteID INT NOT NULL,
    FechaConsulta DATETIME NOT NULL,
    Diagnostico VARCHAR(255),
    Tratamiento VARCHAR(255),
    FOREIGN KEY (MedicoID) REFERENCES Medicos(MedicoID),
    FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID)
) ENGINE=InnoDB;


-- CentrosMedicos
INSERT INTO CentrosMedicos (Nombre, Ciudad, Direccion, Telefono) VALUES
('Centro Médico Quito', 'Ciudad A', 'Av. Principal 123', '555-1234'),
('Centro Médico Guayaquil', 'Ciudad B', 'Calle Secundaria 45', '555-5678'),
('Centro Médico Cuenca', 'Ciudad C', 'Boulevard 789', '555-9012');

-- Especialidades
INSERT INTO Especialidades (Nombre, Descripcion) VALUES
('Cardiología', 'Especialidad en enfermedades del corazón'),
('Pediatría', 'Atención médica para niños'),
('Dermatología', 'Tratamiento de enfermedades de la piel');

-- Medicos
INSERT INTO Medicos (Nombre, Apellido, EspecialidadID, CentroID, Email, Telefono) VALUES
('Juan', 'Pérez', 1, 1, 'juan.perez@centromedico.com', '555-1111'),
('Ana', 'García', 2, 2, 'ana.garcia@saludtotal.com', '555-2222'),
('Luis', 'Martínez', 3, 3, 'luis.martinez@vidanueva.com', '555-3333');

INSERT INTO Medicos (Nombre, Apellido, EspecialidadID, CentroID, Email, Telefono) VALUES
('Ana', 'García', 2, 2, 'ana1.garcia@saludtotal.com', '555-2222'),
('Ana', 'García', 2, 2, 'ana2.garcia@saludtotal.com', '555-2222'),
('Ana', 'García', 2, 2, 'ana3.garcia@saludtotal.com', '555-2222'),
('Ana', 'García', 2, 2, 'ana4.garcia@saludtotal.com', '555-2222'),
('Ana', 'García', 2, 2, 'ana5.garcia@saludtotal.com', '555-2222'),
('Ana', 'García', 2, 2, 'ana6.garcia@saludtotal.com', '555-2222'),
('Ana', 'García', 2, 2, 'ana7.garcia@saludtotal.com', '555-2222'),
('Ana', 'García', 2, 2, 'ana8.garcia@saludtotal.com', '555-2222'),
('Ana', 'García', 2, 2, 'ana9.garcia@saludtotal.com', '555-2222'),
('Ana', 'García', 2, 2, 'ana10.garcia@saludtotal.com', '555-2222');

-- UsuariosCentro
INSERT INTO UsuariosCentro (CentroID, Email, Contrasena) VALUES
(1, 'admin1@centromedico.com', 'pass123'),
(2, 'admin2@saludtotal.com', 'pass456'),
(3, 'admin3@vidanueva.com', 'pass789');

-- AsignacionEspecialidades
INSERT INTO AsignacionEspecialidades (MedicoID, EspecialidadID) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Empleados
INSERT INTO Empleados (Nombre, Apellido, Cargo, Email, Telefono) VALUES
('Carlos', 'Ruiz', 'Recepcionista', 'carlos.ruiz@centromedico.com', '555-4444'),
('María', 'López', 'Enfermera', 'maria.lopez@saludtotal.com', '555-5555'),
('Pedro', 'Sánchez', 'Administrador', 'pedro.sanchez@vidanueva.com', '555-6666');

-- Clientes
INSERT INTO Clientes (Nombre, Apellido, Correo, Telefono) VALUES
('Sofía', 'Fernández', 'sofia.fernandez@email.com', '555-7777'),
('Miguel', 'Torres', 'miguel.torres@email.com', '555-8888'),
('Lucía', 'Ramírez', 'lucia.ramirez@email.com', '555-9999');

INSERT INTO Clientes (Nombre, Apellido, Correo, Telefono) VALUES
('Sofía', 'Torrez', 'sofia.Torrez@email.com', '555-7667');

start transaction;
INSERT INTO Clientes (Nombre, Apellido, Correo, Telefono) VALUES
('Anita', 'Torrez', 'sofia.Torrez@email.com', '555-7667');
commit;

start transaction;
INSERT INTO Consultas (MedicoID, ClienteID, FechaConsulta, Diagnostico, Tratamiento) VALUES
(1, 1, '2024-06-18 09:00:00', 'A', 'Medicamento A');
commit;

start transaction;
INSERT INTO Consultas (MedicoID, ClienteID, FechaConsulta, Diagnostico, Tratamiento) VALUES
(1, 1, '2024-06-18 09:00:00', 'B', 'Medicamento A');
commit;

SET innodb_lock_wait_timeout = 5;

START TRANSACTION;
UPDATE Consultas SET Diagnostico = 'B' WHERE ConsultaID = 19;

commit;

-- Consultas
INSERT INTO Consultas (MedicoID, ClienteID, FechaConsulta, Diagnostico, Tratamiento) VALUES
(1, 1, '2024-06-01 09:00:00', 'Hipertensión', 'Medicamento A'),
(2, 2, '2024-06-02 10:30:00', 'Gripe', 'Reposo y líquidos'),
(3, 3, '2024-06-03 11:15:00', 'Alergia', 'Antihistamínico');


DELIMITER $$

-- Trigger para evitar INSERT duplicados de consultas para el mismo paciente en la misma fecha y hora
CREATE TRIGGER trg_no_insert_consulta_duplicada
BEFORE INSERT ON Consultas
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM Consultas
        WHERE ClienteID = NEW.ClienteID
          AND FechaConsulta = NEW.FechaConsulta
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Ya existe una consulta para este paciente en la misma fecha y hora.';
    END IF;
END$$

-- Trigger para evitar UPDATE que genere duplicados de consultas para el mismo paciente en la misma fecha y hora
CREATE TRIGGER trg_no_update_consulta_duplicada
BEFORE UPDATE ON Consultas
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM Consultas
        WHERE ClienteID = NEW.ClienteID
          AND FechaConsulta = NEW.FechaConsulta
          AND ConsultaID <> OLD.ConsultaID
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se permite actualizar: ya existe una consulta para este paciente en la misma fecha y hora.';
    END IF;
END$$

DELIMITER ;