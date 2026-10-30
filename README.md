# 🧮 Calculadora Moderna en React (AWS Ready)

Una aplicación web moderna de calculadora construida con **React 19**, **Vite** y arquitectura optimizada para despliegue serverless de alto rendimiento y bajo costo en **Amazon Web Services (AWS)**.

---

## ✨ Características Principales

- 🔢 **Modo Básico y Modo Científico**: Trigonometría ($\sin$, $\cos$, $\tan$), logaritmos ($\log$, $\ln$), potencias ($x^2$, $x^y$), raíces ($\sqrt{x}$), factoriales ($n!$), constantes ($\pi$, $e$) y paréntesis.
- 🕒 **Historial de Cálculos**: Registro persistente en `localStorage`, con opción de reutilizar resultados previos o vaciar el historial.
- 🧠 **Funciones de Memoria Estándar**: $MC$ (Memory Clear), $MR$ (Memory Recall), $M+$ (Memory Add), $M-$ (Memory Subtract) y $MS$ (Memory Store).
- 🎨 **Diseño Moderno & Glassmorphism**: Soporte para tema **Oscuro** y **Claro**, con animaciones fluidas y diseño responsivo adaptado a móviles y escritorio.
- ⌨️ **Soporte Completo de Teclado Físico**: Números, operadores (`+`, `-`, `*`, `/`, `%`), `Enter` o `=` para calcular, `Backspace` para borrar dígito, y `Esc` o `C` para limpiar.
- 🔊 **Efectos de Sonido Sintetizados**: Audio háptico generado en tiempo real con Web Audio API (cero dependencias de archivos externos MP3).
- 📋 **Copiar al Portapapeles**: Botón para copiar el resultado con un solo clic y retroalimentación visual.
- 🧪 **Suite de Pruebas Unitarias**: Motor matemático probado con **Vitest**.
- ☁️ **Modal Interactivo de Despliegue en AWS**: Guía paso a paso integrada dentro de la propia aplicación.

---

## 🚀 Inicio Rápido en Local

### Prerrequisitos
- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior

### Instalación y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar pruebas unitarias
npm run test

# 3. Iniciar servidor de desarrollo local
npm run dev
```

Abre tu navegador en `http://localhost:3000`.

### Compilar para Producción

```bash
npm run build
```

Genera la carpeta optimizada y minificada `dist/`.

---

## ☁️ Guías de Despliegue en AWS

Este proyecto está preparado con configuraciones nativas para **4 alternativas de despliegue en AWS**:

### Opción 1: AWS S3 + CloudFront (Recomendado para Producción)

Arquitectura serverless de costo prácticamente nulo, alta velocidad y distribución global mediante la CDN de CloudFront.

#### Paso a paso con AWS CLI:

1. **Compilar el proyecto**:
   ```bash
   npm run build
   ```

2. **Crear el bucket en S3** (si aún no existe):
   ```bash
   aws s3 mb s3://nombre-unico-de-tu-calculadora --region us-east-1
   ```

3. **Sincronizar los archivos compilados**:
   ```bash
   aws s3 sync dist/ s3://nombre-unico-de-tu-calculadora --delete
   ```

4. **Crear invalidación en CloudFront** (tras actualizaciones):
   ```bash
   aws cloudfront create-invalidation --distribution-id TU_DISTRIBUTION_ID --paths "/*"
   ```

> 💡 **Scripts automatizados incluidos**:
> - En Windows PowerShell: `.\scripts\deploy-s3.ps1`
> - En Linux / macOS / Git Bash: `./scripts/deploy-s3.sh`

---

### Opción 2: Despliegue con Infraestructura como Código (CloudFormation)

El proyecto incluye la plantilla `aws/cloudformation.yaml` que aprovisiona automáticamente:
- Bucket S3 privado con cifrado SSE-AES256.
- Control de Acceso de Origen (**Origin Access Control - OAC**) de CloudFront (último estándar de seguridad de AWS).
- Distribución de CloudFront con redirección automática HTTPS y soporte para SPA (páginas de error 403/404 redirigidas a `/index.html`).
- Política de Bucket con mínimos privilegios.

**Para desplegar la infraestructura completa con AWS CLI:**

```bash
aws cloudformation deploy \
  --template-file aws/cloudformation.yaml \
  --stack-name calculadora-react-stack \
  --parameter-overrides ProjectName=calculadora-react \
  --capabilities CAPABILITY_IAM
```

Para ver la URL de CloudFront generada:
```bash
aws cloudformation describe-stacks \
  --stack-name calculadora-react-stack \
  --query "Stacks[0].Outputs"
```

---

### Opción 3: AWS Amplify (Despliegue con 1 Clic desde Git)

El repositorio incluye el archivo de configuración `amplify.yml`:

1. Sube este código a un repositorio en **GitHub**, **GitLab** o **AWS CodeCommit**.
2. Entra a la consola de [AWS Amplify](https://console.aws.amazon.com/amplify).
3. Selecciona **"Host web app"** y vincula tu repositorio y rama `main`.
4. Amplify detectará automáticamente el archivo `amplify.yml` con las fases de prueba (`npm test`) y construcción (`npm run build`).
5. Haz clic en **"Save and deploy"**. Tendrás tu sitio con dominio HTTPS administrado y CI/CD automático.

---

### Opción 4: Contenedor Docker en AWS App Runner o Amazon ECS

El proyecto cuenta con un `Dockerfile` multi-etapa ultra ligero (pesa menos de 25MB) que compila la app y la sirve con Nginx optimizado para SPAs.

1. **Construir y probar localmente**:
   ```bash
   docker build -t react-aws-calculator .
   docker run -p 8080:80 react-aws-calculator
   ```
   Accede en `http://localhost:8080`.

2. **Subir a AWS Elastic Container Registry (ECR)**:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
   docker tag react-aws-calculator:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/react-aws-calculator:latest
   docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/react-aws-calculator:latest
   ```

3. **Desplegar en AWS App Runner**:
   - Crea un servicio en App Runner seleccionando la imagen de ECR.
   - App Runner provee balanceador de carga, certificado SSL y autoescalado automático.

---

## 🤖 CI/CD Automatizado con GitHub Actions

El repositorio incluye el flujo de trabajo `.github/workflows/deploy-aws.yml`.

Para activarlo en tu repositorio de GitHub, añade los siguientes **Secrets** en `Settings > Secrets and variables > Actions`:

| Secret | Descripción |
|---|---|
| `AWS_ACCESS_KEY_ID` | Clave de acceso IAM con permisos para S3 y CloudFront |
| `AWS_SECRET_ACCESS_KEY` | Clave secreta IAM |
| `AWS_REGION` | Región de AWS (ej. `us-east-1`) |
| `AWS_S3_BUCKET_NAME` | Nombre de tu bucket S3 |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | ID de la distribución CloudFront |

Cada vez que hagas `git push` a la rama `main`, GitHub Actions ejecutará los tests, compilará la app, sincronizará S3 y refrescará la CDN de CloudFront automáticamente.

---

## 📁 Estructura del Proyecto

```text
proyec2/
├── .github/
│   └── workflows/
│       └── deploy-aws.yml        # Pipeline CI/CD GitHub Actions
├── aws/
│   └── cloudformation.yaml       # Plantilla IaC de AWS CloudFormation
├── scripts/
│   ├── deploy-s3.ps1             # Script de despliegue en PowerShell
│   └── deploy-s3.sh              # Script de despliegue en Bash
├── src/
│   ├── components/
│   │   ├── AwsInfoModal.jsx      # Modal con guías de AWS en la app
│   │   ├── Display.jsx           # Pantalla con visor de fórmulas y copiado
│   │   ├── Header.jsx            # Barra superior de controles y estado
│   │   ├── HistoryDrawer.jsx     # Panel de historial persistente
│   │   ├── Icons.jsx             # Iconografía SVG nativa y ultra ligera
│   │   └── Keypad.jsx            # Teclado básico y científico
│   ├── utils/
│   │   ├── calculatorEngine.js   # Motor matemático (Shunting-Yard seguro)
│   │   └── calculatorEngine.test.js # Pruebas unitarias con Vitest
│   ├── App.jsx                   # Componente raíz y control de teclado
│   ├── index.css                 # Estilos modernos y temas Claro/Oscuro
│   └── main.jsx                  # Punto de entrada de React
├── amplify.yml                   # Especificación de despliegue en AWS Amplify
├── Dockerfile                    # Contenedor multi-etapa con Nginx
├── index.html                    # Plantilla HTML con fuentes y metadatos
├── nginx.conf                    # Configuración Nginx para React SPA
├── package.json                  # Dependencias y scripts
└── vite.config.js                # Configuración de compilación Vite
```

---

## 📜 Licencia

MIT © 2026. Proyecto desarrollado con React y preparado para despliegue profesional en AWS.

