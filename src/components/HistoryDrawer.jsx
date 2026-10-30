import React from 'react'
import { Trash2, X, Clock } from './Icons'

export function HistoryDrawer({ isOpen, onClose, history, onSelectHistory, onClearHistory }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Clock size={20} color="#6366f1" />
            <span>Historial de Cálculos</span>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar historial">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {history.length === 0 ? (
            <div className="history-empty">
              <p>No hay cálculos recientes en el historial.</p>
              <span style={{ fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>
                Tus operaciones se guardarán automáticamente aquí.
              </span>
            </div>
          ) : (
            <>
              <div className="history-list">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="history-item"
                    onClick={() => {
                      onSelectHistory(item)
                      onClose()
                    }}
                    title="Click para reutilizar este resultado"
                  >
                    <span className="history-item-exp">{item.expression} =</span>
                    <span className="history-item-res">{item.result}</span>
                  </div>
                ))}
              </div>

              <button
                className="btn btn-clear"
                style={{ height: '2.75rem', marginTop: '0.5rem', gap: '0.5rem' }}
                onClick={onClearHistory}
              >
                <Trash2 size={16} />
                <span>Borrar Todo el Historial</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
