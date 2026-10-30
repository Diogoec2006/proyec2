# Script de PowerShell para desplegar la Calculadora React en AWS S3 y CloudFront
param(
    [string]$BucketName = $env:AWS_S3_BUCKET_NAME,
    [string]$DistributionId = $env:AWS_CLOUDFRONT_DISTRIBUTION_ID
)

$ErrorActionPreference = "Stop"

if (-not $BucketName) {
    $BucketName = Read-Host "Introduce el nombre del Bucket S3 en AWS"
}

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "🚀 Iniciando despliegue en AWS S3 & CloudFront" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Pruebas unitarias
Write-Host "🧪 Ejecutando pruebas unitarias..." -ForegroundColor Yellow
npm run test

# 2. Compilar
Write-Host "📦 Compilando aplicación React para producción..." -ForegroundColor Yellow
npm run build

# 3. Subir a S3
Write-Host "☁️ Sincronizando carpeta dist/ con s3://$BucketName..." -ForegroundColor Yellow
aws s3 sync dist/ "s3://$BucketName" --delete

# 4. Invalidar CloudFront si se indicó
if ($DistributionId) {
    Write-Host "🔄 Creando invalidación de caché en CloudFront ($DistributionId)..." -ForegroundColor Yellow
    aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/*"
}

Write-Host "=============================================" -ForegroundColor Green
Write-Host "✅ ¡Despliegue completado con éxito en AWS!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

