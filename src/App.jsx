import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Header } from './components/Header'
import { Display } from './components/Display'
import { Keypad } from './components/Keypad'
import { HistoryDrawer } from './components/HistoryDrawer'
import { AwsInfoModal } from './components/AwsInfoModal'
import { evaluateExpression, formatResult, SoundEffects } from './utils/calculatorEngine'
import { Cloud } from './components/Icons'

export function App() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('0')
  const [memory, setMemory] = useState(0)
  const [isScientific, setIsScientific] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isAwsModalOpen, setIsAwsModalOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [justCalculated, setJustCalculated] = useState(false)

  // Sonidos
  const sound = useMemo(() => new SoundEffects(), [])

  // Cargar tema desde localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('calc_theme')
    return saved ? saved === 'dark' : true
  })

  // Sincronizar tema con el DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('calc_theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('calc_theme', 'light')
    }
  }, [isDarkMode])

  // Cargar historial desde localStorage
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('calc_history')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Guardar historial en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('calc_history', JSON.stringify(history))
    } catch (e) {
      console.error('Error al guardar historial:', e)
    }
  }, [history])

  // Manejador de entrada de dígitos
  const handleDigit = useCallback((digit) => {
    if (justCalculated) {
      if (digit === '.') {
        setExpression('0.')
        setResult('0.')
      } else {
        setExpression(digit)
        setResult(digit)
      }
      setJustCalculated(false)
      return
    }

    if (result === '0' && digit !== '.') {
      setExpression((prev) => (prev === '0' ? digit : prev + digit))
      setResult(digit)
    } else {
      if (digit === '.' && result.includes('.')) return
      setExpression((prev) => prev + digit)
      setResult((prev) => (prev === '0' && digit !== '.' ? digit : prev + digit))
    }
  }, [justCalculated, result])

  // Manejador de operadores (+, -, ×, ÷, %)
  const handleOperator = useCallback((op) => {
    setJustCalculated(false)

    if (!expression) {
      setExpression(result + ' ' + op + ' ')
      return
    }

    const trimmed = expression.trimEnd()
    const lastChar = trimmed.slice(-1)
    if (['+', '-', '×', '÷', '%'].includes(lastChar)) {
      setExpression(trimmed.slice(0, -1) + op + ' ')
      return
    }

    setExpression((prev) => prev + ' ' + op + ' ')
    setResult('0')
  }, [expression, result])

  // Manejador de funciones científicas
  const handleScientificFn = useCallback((fn) => {
    setJustCalculated(false)
    if (fn === '^2') {
      setExpression((prev) => (prev ? `(${prev})^2` : '0^2'))
    } else if (fn === '1/') {
      setExpression((prev) => `1/(${prev || result})`)
    } else {
      setExpression((prev) => prev + fn)
    }
  }, [result])

  // Alternar signo ±
  const handleToggleSign = useCallback(() => {
    if (!result || result === '0') return
    if (result.startsWith('-')) {
      const positive = result.slice(1)
      setResult(positive)
      setExpression((prev) => prev.endsWith(result) ? prev.slice(0, -result.length) + positive : prev)
    } else {
      const negative = '-' + result
      setResult(negative)
      setExpression((prev) => prev.endsWith(result) ? prev.slice(0, -result.length) + negative : prev)
    }
  }, [result])

  // Ejecutar cálculo (=)
  const handleEquals = useCallback(() => {
    if (!expression) return

    try {
      const calcResult = evaluateExpression(expression)
      const formatted = formatResult(calcResult)

      const newEntry = {
        id: Date.now(),
        expression: expression,
        result: formatted,
        timestamp: new Date().toLocaleTimeString()
      }

      setHistory((prev) => [newEntry, ...prev].slice(0, 50))
      setResult(formatted)
      setExpression(expression)
      setJustCalculated(true)
    } catch (err) {
      setResult(err.message || 'Error')
      setJustCalculated(true)
    }
  }, [expression])

  // Limpiar todo (AC)
  const handleClear = useCallback(() => {
    setExpression('')
    setResult('0')
    setJustCalculated(false)
  }, [])

  // Borrar último caracter (Backspace)
  const handleBackspace = useCallback(() => {
    if (justCalculated) {
      handleClear()
      return
    }

    setExpression((prev) => {
      const next = prev.trimEnd().slice(0, -1)
      return next
    })

    setResult((prev) => {
      if (prev.length <= 1 || prev === 'Error') return '0'
      return prev.slice(0, -1)
    })
  }, [justCalculated, handleClear])

  // Operaciones de Memoria (MC, MR, M+, M-, MS)
  const handleMemory = useCallback((action) => {
    const currentVal = parseFloat(result) || 0

    switch (action) {
      case 'MC':
        setMemory(0)
        break
      case 'MR':
        setResult(formatResult(memory))
        setExpression((prev) => prev + String(memory))
        break
      case 'M+':
        setMemory((prev) => prev + currentVal)
        break
      case 'M-':
        setMemory((prev) => prev - currentVal)
        break
      case 'MS':
        setMemory(currentVal)
        break
      default:
        break
    }
  }, [result, memory])

  // Soporte completo para teclado físico
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if (e.key >= '0' && e.key <= '9') {
        sound.playClick()
        handleDigit(e.key)
      } else if (e.key === '.') {
        sound.playClick()
        handleDigit('.')
      } else if (e.key === '+') {
        sound.playClick()
        handleOperator('+')
      } else if (e.key === '-') {
        sound.playClick()
        handleOperator('-')
      } else if (e.key === '*') {
        sound.playClick()
        handleOperator('×')
      } else if (e.key === '/') {
        e.preventDefault()
        sound.playClick()
        handleOperator('÷')
      } else if (e.key === '%') {
        sound.playClick()
        handleOperator('%')
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault()
        sound.playEquals()
        handleEquals()
      } else if (e.key === 'Backspace') {
        sound.playClick()
        handleBackspace()
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        sound.playClick()
        handleClear()
      } else if (e.key === '(' || e.key === ')') {
        sound.playClick()
        handleScientificFn(e.key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleDigit, handleOperator, handleEquals, handleBackspace, handleClear, handleScientificFn, sound])

  // Reusar un cálculo del historial
  const handleSelectHistory = (item) => {
    setExpression(item.expression)
    setResult(item.result)
    setJustCalculated(true)
  }

  // Limpiar historial
  const handleClearHistory = () => {
    sound.playClick()
    setHistory([])
  }

  return (
    <div className="app-container">
      <main className="calculator-card">
        <Header
          isScientific={isScientific}
          setIsScientific={setIsScientific}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          historyCount={history.length}
          setIsHistoryOpen={setIsHistoryOpen}
          setIsAwsModalOpen={setIsAwsModalOpen}
          sound={sound}
        />

        <Display
          expression={expression}
          result={result}
          memory={memory}
          isScientific={isScientific}
        />

        <Keypad
          onDigit={handleDigit}
          onOperator={handleOperator}
          onClear={handleClear}
          onBackspace={handleBackspace}
          onEquals={handleEquals}
          onScientificFn={handleScientificFn}
          onToggleSign={handleToggleSign}
          onMemory={handleMemory}
          isScientific={isScientific}
          sound={sound}
        />
      </main>

      <footer className="aws-footer">
        <span>Diseñado para despliegue serverless en</span>
        <button 
          onClick={() => setIsAwsModalOpen(true)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#818cf8', 
            cursor: 'pointer', 
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontFamily: 'inherit'
          }}
        >
          <Cloud size={14} /> AWS Cloud (S3 / CloudFront / Amplify)
        </button>
      </footer>

      {/* Cajón de Historial */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={handleSelectHistory}
        onClearHistory={handleClearHistory}
      />

      {/* Modal con guía paso a paso de AWS */}
      <AwsInfoModal
        isOpen={isAwsModalOpen}
        onClose={() => setIsAwsModalOpen(false)}
      />
    </div>
  )
}
export default App
