import React from 'react'
import {
  Calculator,
  FlaskConical,
  History,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Cloud
} from './Icons'

export function Header({
  isScientific,
  setIsScientific,
  isDarkMode,
  setIsDarkMode,
  isMuted,
  setIsMuted,
  historyCount,
  setIsHistoryOpen,
  setIsAwsModalOpen,
  sound
}) {
  const toggleSound = () => {
    const next = !isMuted
    setIsMuted(next)
    sound.enabled = !next
    if (!next) sound.playClick()
  }

  const toggleTheme = () => {
    sound.playClick()
    setIsDarkMode(!isDarkMode)
  }

  const toggleScientific = () => {
    sound.playClick()
    setIsScientific(!isScientific)
  }

  return (
    <header className="header">
      <div className="brand">
        <div className="brand-icon">
          <Calculator size={18} />
        </div>
        <div className="brand-title">
          <span>Calculadora cientifica</span>
          <span className="aws-badge">AWS Ready</span>
        </div>
      </div>

      <div className="header-controls">
        <button
          className={`icon-btn ${isScientific ? 'active' : ''}`}
          onClick={toggleScientific}
          title={isScientific ? 'Modo Básico' : 'Modo Científico'}
          aria-label="Alternar modo científico"
        >
          <FlaskConical size={16} />
        </button>

        <button
          className="icon-btn"
          onClick={toggleSound}
          title={isMuted ? 'Activar sonido' : 'Silenciar'}
          aria-label="Alternar sonido"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <button
          className="icon-btn"
          onClick={toggleTheme}
          title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
          aria-label="Alternar tema visual"
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button
          className="icon-btn"
          onClick={() => {
            sound.playClick()
            setIsHistoryOpen(true)
          }}
          title="Historial de cálculos"
          aria-label="Ver historial"
        >
          <History size={16} />
          {historyCount > 0 && <span className="badge-counter">{historyCount}</span>}
        </button>

        <button
          className="icon-btn"
          onClick={() => {
            sound.playClick()
            setIsAwsModalOpen(true)
          }}
          title="Cómo desplegar en AWS"
          aria-label="Guía de despliegue AWS"
        >
          <Cloud size={16} color="#f59e0b" />
        </button>
      </div>
    </header>
  )
}
