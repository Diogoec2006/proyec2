import React, { useState } from 'react'
import { Copy, Check } from './Icons'

export function Display({ expression, result, memory, isScientific }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    const textToCopy = result || expression || '0'
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getResultClass = (text) => {
    if (!text) return ''
    const len = String(text).length
    if (len > 14) return 'very-long'
    if (len > 9) return 'long'
    return ''
  }

  return (
    <div className="display-panel" role="region" aria-label="Pantalla de la calculadora">
      <div className="display-meta">
        <div className="display-badges">
          {isScientific && <span className="display-badge">DEG</span>}
          {memory !== 0 && <span className="display-badge">M: {memory}</span>}
        </div>

        <button 
          className="display-copy-btn" 
          onClick={copyToClipboard}
          title="Copiar resultado"
          aria-label="Copiar al portapapeles"
        >
          {copied ? (
            <>
              <Check size={13} color="#10b981" />
              <span style={{ color: '#10b981' }}>Copiado</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      <div className="display-expression" aria-label="Expresión matemática">
        {expression || ''}
      </div>

      <div 
        className={`display-result ${getResultClass(result)}`}
        aria-live="polite"
        aria-label="Resultado actual"
      >
        {result}
      </div>
    </div>
  )
}
