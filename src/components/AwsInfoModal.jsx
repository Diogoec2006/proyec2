import React, { useState } from 'react'
import { X, Cloud, Check, Copy, Zap } from './Icons'

export function AwsInfoModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('s3')
  const [copiedIndex, setCopiedIndex] = useState(null)

  if (!isOpen) return null

  const copyText = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Cloud size={22} color="#f59e0b" />
            <span>Guía de Despliegue en AWS</span>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar modal">
            <X size={18} />
          </button>
        </div>

        {/* Pestañas de métodos */}
        <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem 1.5rem 0', borderBottom: '1px solid var(--card-border)' }}>
          <button
            className={`btn ${activeTab === 's3' ? 'btn-op' : 'btn-num'}`}
            style={{ height: '2.5rem', fontSize: '0.85rem', flex: 1 }}
            onClick={() => setActiveTab('s3')}
          >
            S3 + CloudFront (Recomendado)
          </button>
          <button
            className={`btn ${activeTab === 'amplify' ? 'btn-op' : 'btn-num'}`}
            style={{ height: '2.5rem', fontSize: '0.85rem', flex: 1 }}
            onClick={() => setActiveTab('amplify')}
          >
            AWS Amplify (Automático)
          </button>
          <button
            className={`btn ${activeTab === 'docker' ? 'btn-op' : 'btn-num'}`}
            style={{ height: '2.5rem', fontSize: '0.85rem', flex: 1 }}
            onClick={() => setActiveTab('docker')}
          >
            Docker / App Runner
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 's3' && (
            <>
              <div className="deploy-step">
                <h4><Zap size={16} color="#6366f1" /> Opción 1: AWS S3 + CloudFront (CDN Global)</h4>
                <p>
                  Es la arquitectura estándar para Single Page Applications (SPAs) en producción: costo prácticamente nulo, alta velocidad y distribución global mediante CloudFront CDN.
                </p>
              </div>

              <div className="deploy-step">
                <h4>1. Compilar el proyecto para producción:</h4>
                <div className="code-block" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code>npm run build</code>
                  <button 
                    onClick={() => copyText('npm run build', 1)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {copiedIndex === 1 ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="deploy-step">
                <h4>2. Crear bucket S3 y sincronizar la carpeta dist/:</h4>
                <div className="code-block" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code>aws s3 sync dist/ s3://mi-calculadora-react-bucket --delete</code>
                  <button 
                    onClick={() => copyText('aws s3 sync dist/ s3://mi-calculadora-react-bucket --delete', 2)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {copiedIndex === 2 ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="deploy-step">
                <h4>3. Invalidar caché en CloudFront tras actualizar:</h4>
                <div className="code-block" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code>aws cloudfront create-invalidation --distribution-id TU_ID --paths "/*"</code>
                  <button 
                    onClick={() => copyText('aws cloudfront create-invalidation --distribution-id TU_ID --paths "/*"', 3)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {copiedIndex === 3 ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ⭐ Nota: El repositorio incluye una plantilla lista de <strong>CloudFormation</strong> (en <code>aws/cloudformation.yaml</code>) y un workflow de <strong>GitHub Actions</strong> (<code>.github/workflows/deploy-aws.yml</code>) para despliegue automatizado.
              </p>
            </>
          )}

          {activeTab === 'amplify' && (
            <>
              <div className="deploy-step">
                <h4><Zap size={16} color="#6366f1" /> Opción 2: AWS Amplify (Despliegue con 1 clic)</h4>
                <p>
                  La forma más fácil y rápida sin gestionar infraestructura. Ya dejamos configurado el archivo <code>amplify.yml</code> en la raíz del proyecto.
                </p>
              </div>

              <div className="deploy-step">
                <h4>Pasos para conectar:</h4>
                <ol style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                  <li>Sube este proyecto a tu repositorio de GitHub o GitLab.</li>
                  <li>Inicia sesión en la consola de <strong>AWS Amplify</strong>.</li>
                  <li>Haz clic en <strong>"Host web app"</strong> y selecciona tu repositorio.</li>
                  <li>Amplify detectará automáticamente el archivo <code>amplify.yml</code>.</li>
                  <li>Haz clic en <strong>"Save and deploy"</strong>. ¡Listo en menos de 2 minutos!</li>
                </ol>
              </div>
            </>
          )}

          {activeTab === 'docker' && (
            <>
              <div className="deploy-step">
                <h4><Zap size={16} color="#6366f1" /> Opción 3: Contenedor Docker (App Runner / ECS)</h4>
                <p>
                  Si prefieres desplegar mediante contenedores, el proyecto incluye un <code>Dockerfile</code> multi-etapa ultra ligero basado en Alpine Linux y Nginx.
                </p>
              </div>

              <div className="deploy-step">
                <h4>1. Construir la imagen Docker:</h4>
                <div className="code-block" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code>docker build -t react-calculator .</code>
                  <button 
                    onClick={() => copyText('docker build -t react-calculator .', 4)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {copiedIndex === 4 ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="deploy-step">
                <h4>2. Probar localmente en el puerto 8080:</h4>
                <div className="code-block" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code>docker run -p 8080:80 react-calculator</code>
                  <button 
                    onClick={() => copyText('docker run -p 8080:80 react-calculator', 5)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {copiedIndex === 5 ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="deploy-step">
                <h4>3. Subir a AWS ECR y desplegar en AWS App Runner:</h4>
                <p>
                  Desde AWS App Runner, selecciona tu imagen en ECR y AWS creará automáticamente una URL con SSL administrado y auto-escalado.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
