# Este script contiene comandos para automatizar la sincronización de bases de datos MySQL
# entre un servidor maestro y varios servidores esclavos. A continuación, se describe el propósito
# de cada comando utilizado:

ssh-keygen -t ed25519
# Genera un par de claves SSH utilizando el algoritmo Ed25519 para autenticar conexiones seguras
# entre el servidor maestro y los esclavos sin necesidad de ingresar contraseñas.

ssh-copy-id ubuntu@192.168.1.57
ssh-copy-id ubuntu@192.168.1.8 
# Copia la clave pública generada al servidor esclavo especificado, permitiendo la autenticación
# sin contraseña para el usuario 'ubuntu' en las direcciones IP indicadas.

vi mysql_replication_sync.sh
# Abre un editor de texto (vi) para crear o editar el script de sincronización de replicación MySQL.

chmod +x mysql_replication_sync.sh
# Otorga permisos de ejecución al script mysql_replication_sync.sh para que pueda ejecutarse como un programa.

cp mysql_replication_sync.sh /usr/local/bin/
# Copia el script de sincronización al directorio /usr/local/bin/, que es un lugar común para almacenar
# scripts ejecutables personalizados en el sistema.

touch /var/log/mysql_replication.log
# Crea un archivo vacío llamado mysql_replication.log en el directorio /var/log/, que se utilizará
# para registrar eventos o errores relacionados con la sincronización.

chown uDbuntu:ubuntu /var/log/mysql_replication.log
# Cambia el propietario del archivo de registro a 'ubuntu', asegurando que este usuario tenga
# permisos para escribir en el archivo.

crontab -e
# Abre el archivo de configuración de cron para programar tareas automáticas, como la ejecución
# periódica del script de sincronización.

vi /usr/local/bin/mysql_replication_sync.sh
# Abre el script de sincronización en el editor de texto para realizar modificaciones o revisiones.

mkdir -p /backups/mysql
# Crea un directorio para almacenar los respaldos de MySQL en los servidores esclavos. La opción -p
# asegura que se creen todos los directorios necesarios en la ruta si no existen.

chown -R ubuntu:ubuntu /backups
# Cambia el propietario del directorio /backups y todos sus subdirectorios y archivos al usuario 'ubuntu',
# asegurando que este tenga permisos adecuados para gestionar los respaldos.

ls /backups/mysql/
# db_backup_20250430035008.sql.gz  db_backup_20250430040602.sql.gz  mysqld.cnf
# Lista los archivos en el directorio de respaldos en el servidor esclavo para verificar que los
# respaldos y configuraciones se hayan copiado correctamente. En este caso, se muestran archivos
# de respaldo y un archivo de configuración de MySQL.
# Los comandos son para automatizar la sincronización de bases de datos MySQL entre un servidor maestro y varios esclavos.


