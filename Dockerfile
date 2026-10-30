# Etapa 1: Compilación de la aplicación React
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm ci

# Copiar el código fuente y compilar
COPY . .
RUN npm run test
RUN npm run build

# Etapa 2: Servidor web ultra ligero con Nginx
FROM nginx:alpine-slim

# Copiar configuración optimizada para SPA de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar artefactos compilados desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto 80 estándar
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

