-- ##################################################################################################
-- Script de configuración para la replicación en MySQL (Servidor Esclavo)
-- Archivo: Centro_Medico_Guayaquil.sql
-- Descripción: Este script configura un servidor esclavo para la replicación de datos desde un servidor maestro.
-- Incluye la configuración inicial del esclavo, verificaciones, reinicio de replicación y creación de vistas.
-- ##################################################################################################

-- ##################################################################################################
-- CREACIÓN DE LA BASE DE DATOS
-- ##################################################################################################

-- Crear la base de datos para la gestión hospitalaria si no existe.
-- Esto asegura que el esquema esté disponible antes de iniciar la replicación.
CREATE DATABASE IF NOT EXISTS GestionHospitalaria;

-- ##################################################################################################
-- CONFIGURACIÓN INICIAL DEL ESCLAVO PARA LA REPLICACIÓN
-- ##################################################################################################

-- Configurar el servidor esclavo para conectarse al servidor maestro.
-- NOTA: Asegúrate de que los valores de MASTER_HOST, MASTER_USER, MASTER_PASSWORD, MASTER_LOG_FILE y MASTER_LOG_POS
-- coincidan con los valores del servidor maestro. Estos valores deben ser proporcionados por el administrador del maestro.
CHANGE MASTER TO
    MASTER_HOST 	= '34.138.196.138',               -- Dirección IP o nombre del host del servidor maestro
    MASTER_USER 	= 'replicator',                -- Usuario configurado para la replicación en el maestro
    MASTER_PASSWORD = 'Centromedico@123',          -- Contraseña del usuario de replicación
    MASTER_LOG_FILE = 'mysql-bin.000002',      -- Archivo de registro binario actual en el maestro
    MASTER_LOG_POS 	= 9641;                     -- Posición en el archivo binario del maestro

-- Iniciar el proceso de replicación en el servidor esclavo.
START SLAVE;

-- ##################################################################################################
-- VERIFICACIONES INICIALES
-- ##################################################################################################

-- Mostrar los primeros 10 eventos del relay log para verificar que los datos se están replicando correctamente.
SHOW RELAYLOG EVENTS IN 'mysql-relay-bin.000002';

-- Mostrar las variables relacionadas con la replicación para confirmar la configuración.
SHOW VARIABLES LIKE '%replicate%';

-- Mostrar el estado del esclavo para verificar que la replicación esté funcionando correctamente.
-- Esto incluye información como el estado de conexión con el maestro y posibles errores.
SHOW SLAVE STATUS;

-- NOTA IMPORTANTE: Verificar si las variables MASTER_ son correctas. Si no coinciden, realizar los ajustes necesarios.

-- ##################################################################################################
-- REINICIO Y RECONFIGURACIÓN DEL ESCLAVO (SI ES NECESARIO)
-- ##################################################################################################

-- Detener el proceso de replicación en caso de que sea necesario realizar ajustes.
STOP SLAVE;

-- Reiniciar la configuración del esclavo para limpiar cualquier configuración previa.
RESET SLAVE ALL;

-- Reconfigurar el esclavo con nuevos valores (si es necesario).
CHANGE MASTER TO
    MASTER_HOST 	= '34.138.196.138',               -- Dirección IP o nombre del host del servidor maestro
    MASTER_USER 	= 'replicator',                -- Usuario configurado para la replicación en el maestro
    MASTER_PASSWORD = 'Centromedico@123',          -- Contraseña del usuario de replicación
    MASTER_LOG_FILE = 'mysql-bin.000003',      -- Archivo de registro binario actual en el maestro
    MASTER_LOG_POS 	= 754;                     -- Posición en el archivo binario del maestro

-- Iniciar nuevamente el proceso de replicación después de la reconfiguración.
START SLAVE;

-- ##################################################################################################
-- VERSIONES DE MYSQL SUPERIOR A 8.0.22
-- ##################################################################################################

-- Si estás utilizando MySQL 8.0.22 o superior, es necesario habilitar la compatibilidad con versiones anteriores.
SET GLOBAL show_compatibility_56 = ON;

-- Detener el proceso de replicación en caso de que sea necesario realizar ajustes.
STOP REPLICA;

-- Reiniciar la configuración del esclavo para limpiar cualquier configuración previa.
RESET REPLICA ALL;

-- Reconfigurar el esclavo con nuevos valores (si es necesario).
CHANGE REPLICATION SOURCE TO
    SOURCE_HOST 	= '10.0.0.2',
    SOURCE_USER 	= 'replicator',
    SOURCE_PASSWORD = 'Centromedico@123',
    SOURCE_LOG_FILE = 'mysql-bin.000006',
    SOURCE_LOG_POS 	= 10580;

-- Iniciar nuevamente el proceso de replicación después de la reconfiguración.
START REPLICA;

-- Mostrar el estado del esclavo para verificar que la replicación esté funcionando correctamente.
SHOW REPLICA STATUS;

-- ##################################################################################################
-- INFORMACIÓN ADICIONAL PARA LA VERIFICACIÓN
-- ##################################################################################################

-- Verificar la versión del servidor MySQL para asegurarse de que sea compatible con la replicación configurada.
SELECT @@version;

-- Mostrar el UUID del servidor para asegurarse de que no esté duplicado en otra máquina.
-- El UUID debe ser único para cada servidor en la replicación.
SHOW VARIABLES LIKE 'server_uuid';

-- ##################################################################################################
-- CREACIÓN DE UNA VISTA PARA CONSULTAS ESPECÍFICAS
-- ##################################################################################################

-- Cambiar al esquema de la base de datos para trabajar con las tablas replicadas.
USE GestionHospitalaria;

-- Crear una vista para filtrar las consultas médicas realizadas en Guayaquil.
-- Esto permite realizar consultas específicas sobre los datos replicados.
CREATE VIEW ConsultasGUAYAQUIL AS
SELECT * 
FROM GestionHospitalaria.Consultas C, GestionHospitalaria.Medicos M, GestionHospitalaria.CentroMedico CM
WHERE C.MedicoID = M.MedicoID
AND M.CentroID = CM.CentroID
AND CM.CentroMedico = 'Centro Médico Guayaquil';

-- ##################################################################################################
-- FIN DEL SCRIPT
-- ##################################################################################################