#!/usr/bin/env bash
# Script para desplegar la Calculadora React en AWS S3 y CloudFront
set -e

# Configuración (Modifica estos valores o pásalos como variables de entorno)
BUCKET_NAME="${AWS_S3_BUCKET_NAME:-}"
DISTRIBUTION_ID="${AWS_CLOUDFRONT_DISTRIBUTION_ID:-}"

if [ -z "$BUCKET_NAME" ]; then
  read -p "Introduce el nombre del Bucket S3 en AWS: " BUCKET_NAME
fi

echo "============================================="
echo "🚀 Iniciando despliegue en AWS S3 & CloudFront"
echo "============================================="

# 1. Ejecutar pruebas
echo "🧪 Ejecutando pruebas unitarias..."
npm run test

# 2. Compilar
echo "📦 Compilando aplicación React para producción..."
npm run build

# 3. Subir a S3
echo "☁️ Sincronizando carpeta dist/ con s3://$BUCKET_NAME..."
aws s3 sync dist/ "s3://$BUCKET_NAME" --delete

# 4. Invalidar CloudFront (Opcional si se especifica)
if [ -n "$DISTRIBUTION_ID" ]; then
  echo "🔄 Creando invalidación en CloudFront ($DISTRIBUTION_ID)..."
  aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*"
fi

echo "============================================="
echo "✅ Despliegue completado con éxito."
echo "============================================="

