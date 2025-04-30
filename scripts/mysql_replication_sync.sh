#!/bin/bash

# Configuración de variables
MASTER_IP="192.168.1.57"  # Dirección IP del servidor maestro
SLAVES=("192.168.1.21" "192.168.1.22")  # Lista de direcciones IP de los servidores esclavos
MYSQL_USER="ubuntu"  # Usuario de MySQL
MYSQL_PASS="Ubuntu@123"  # Contraseña de MySQL (reemplazar con la real)
BACKUP_DIR="/backups/mysql"  # Directorio donde se almacenarán los backups
CONF_FILE="/etc/mysql/mysql.conf.d/mysqld.cnf"  # Archivo de configuración de MySQL (ajustar según la configuración)

# Crear el directorio de backups si no existe
mkdir -p "$BACKUP_DIR"

# Generar un nombre de archivo único con un timestamp
TIMESTAMP=$(date +"%Y%m%d%H%M%S")  # Obtener la fecha y hora actual en formato YYYYMMDDHHMMSS
BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql"  # Nombre del archivo de backup

# Crear un dump de todas las bases de datos
mysqldump -u "$MYSQL_USER" -p"$MYSQL_PASS" --all-databases --single-transaction --master-data > "$BACKUP_FILE"

# Comprimir el archivo de backup para ahorrar espacio y ancho de banda
gzip "$BACKUP_FILE"

# Enviar el archivo de backup y el archivo de configuración a cada servidor esclavo
for SLAVE_IP in "${SLAVES[@]}"; do
    echo "Enviando backup y configuración a $SLAVE_IP..."  # Mensaje informativo
    rsync -avz -e "ssh -o StrictHostKeyChecking=no" \  # Sincronizar archivos usando rsync y SSH
        "$BACKUP_FILE.gz" \  # Archivo de backup comprimido
        "$CONF_FILE" \  # Archivo de configuración de MySQL
        "ubuntu@$SLAVE_IP:/backups/mysql/"  # Ruta de destino en el servidor esclavo
done

# Limpiar backups antiguos (opcional, conservar solo los últimos 5 días)
find "$BACKUP_DIR" -type f -name "*.gz" -mtime +1 -exec rm {} \;  # Eliminar archivos .gz con más de 1 día de antigüedad