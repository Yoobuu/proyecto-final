#!/bin/bash

# Detener el script en caso de error
set -e

echo "Iniciando configuración del entorno..."

# Actualizar paquetes del sistema
echo "Actualizando paquetes del sistema..."
sudo apt-get update -y && sudo apt-get upgrade -y

# Instalar dependencias necesarias
echo "Instalando dependencias necesarias..."
sudo apt-get install -y git curl docker docker-compose nodejs npm postgresql postgresql-contrib

# Clonar el repositorio (si no está clonado)
# echo "Clonando el repositorio..."
# git clone <URL_DEL_REPOSITORIO> proyecto
# cd proyecto

# Instalar dependencias del backend
echo "Configurando el backend..."
cd backend
npm install
cd ..

# Instalar dependencias del frontend
echo "Configurando el frontend..."
cd frontend
npm install
cd ..

# Configurar la base de datos
echo "Configurando la base de datos..."
sudo systemctl start postgresql
sudo -u postgres psql -c "CREATE DATABASE biblioteca;"
sudo -u postgres psql -c "CREATE USER usfq_user WITH ENCRYPTED PASSWORD 'usfq_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE biblioteca TO usfq_user;"

# Ejecutar migraciones (si las hay)
# echo "Ejecutando migraciones..."
# cd backend
# npx sequelize-cli db:migrate
# cd ..

# Configurar Docker Compose y levantar servicios
echo "Levantando servicios con Docker Compose..."
sudo docker-compose up --build -d

# Mensaje final
echo "Configuración completada. Accede a la aplicación en http://localhost:3000"
