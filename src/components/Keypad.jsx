import React from 'react'
import { Delete } from './Icons'

export function Keypad({
  onDigit,
  onOperator,
  onClear,
  onBackspace,
  onEquals,
  onScientificFn,
  onToggleSign,
  onMemory,
  isScientific,
  sound
}) {
  const handleBtnClick = (action) => {
    sound.playClick()
    action()
  }

  const handleEqualsClick = () => {
    sound.playEquals()
    onEquals()
  }

  return (
    <div className="keypad-wrapper">
      {/* Barra de memoria */}
      <div className="memory-bar">
        <button className="mem-btn" onClick={() => handleBtnClick(() => onMemory('MC'))} title="Limpiar memoria">MC</button>
        <button className="mem-btn" onClick={() => handleBtnClick(() => onMemory('MR'))} title="Recuperar de memoria">MR</button>
        <button className="mem-btn" onClick={() => handleBtnClick(() => onMemory('M+'))} title="Sumar a memoria">M+</button>
        <button className="mem-btn" onClick={() => handleBtnClick(() => onMemory('M-'))} title="Restar de memoria">M-</button>
        <button className="mem-btn" onClick={() => handleBtnClick(() => onMemory('MS'))} title="Guardar en memoria">MS</button>
      </div>

      {/* Grid científico opcional */}
      {isScientific && (
        <div className="scientific-grid">
          <button className="btn btn-fn" onClick={() => handleBtnClick(() => onScientificFn('sin('))}>sin</button>
          <button className="btn btn-fn" onClick={() => handleBtnClick(() => onScientificFn('cos('))}>cos</button>
          <button className="btn btn-fn" onClick={() => handleBtnClick(() => onScientificFn('tan('))}>tan</button>
          <button className="btn btn-fn" onClick={() => handleBtnClick(() => onScientificFn('('))}>(</button>
          <button className="btn btn-fn" onClick={() => handleBtnClick(() => onScientificFn(')'))}>)</button>

          <button className="btn btn-fn" onClick={() => handleBtnClick(() => onScientificFn('sqrt('))}>√x</button>
          <button className="btn btn-fn" onClick={() => handleBtnClick(() => onScientificFn('^2'))}>x²</button>
          <button className="btn btn-fn" onClick={() => handleBtnClick(() => onScientificFn('^'))}>xʸ</button>
          <button className="btn btn-fn" onClick={() => handleBtnClick(() => onScientificFn('π'))}>π</button>
          <button className="btn btn-fn" onClick={() => handleBtnClick(() => onScientificFn('e'))}>e</button>

          <button className="btn btn-fn" onClick={() => handleBtnClick(() => onScientificFn('log('))}>log</button>
          <button className="btn btn-fn" onClick={() => handleBtnClick(() => onScientificFn('ln('))}>ln</button>
          <button className="btn btn-fn" onClick={() => handleBtnClick(() => onScientificFn('fact('))}>n!</button>
          <button className="btn btn-fn" onClick={() => handleBtnClick(() => onScientificFn('1/'))}>1/x</button>
          <button className="btn btn-fn" onClick={() => handleBtnClick(() => onScientificFn('abs('))}>|x|</button>
        </div>
      )}

      {/* Teclado Principal */}
      <div className="main-grid">
        <button className="btn btn-clear" onClick={() => handleBtnClick(onClear)}>AC</button>
        <button className="btn btn-fn" onClick={() => handleBtnClick(onBackspace)} aria-label="Borrar último dígito">
          <Delete size={20} />
        </button>
        <button className="btn btn-fn" onClick={() => handleBtnClick(() => onOperator('%'))}>%</button>
        <button className="btn btn-op" onClick={() => handleBtnClick(() => onOperator('÷'))}>÷</button>

        <button className="btn btn-num" onClick={() => handleBtnClick(() => onDigit('7'))}>7</button>
        <button className="btn btn-num" onClick={() => handleBtnClick(() => onDigit('8'))}>8</button>
        <button className="btn btn-num" onClick={() => handleBtnClick(() => onDigit('9'))}>9</button>
        <button className="btn btn-op" onClick={() => handleBtnClick(() => onOperator('×'))}>×</button>

        <button className="btn btn-num" onClick={() => handleBtnClick(() => onDigit('4'))}>4</button>
        <button className="btn btn-num" onClick={() => handleBtnClick(() => onDigit('5'))}>5</button>
        <button className="btn btn-num" onClick={() => handleBtnClick(() => onDigit('6'))}>6</button>
        <button className="btn btn-op" onClick={() => handleBtnClick(() => onOperator('-'))}>−</button>

        <button className="btn btn-num" onClick={() => handleBtnClick(() => onDigit('1'))}>1</button>
        <button className="btn btn-num" onClick={() => handleBtnClick(() => onDigit('2'))}>2</button>
        <button className="btn btn-num" onClick={() => handleBtnClick(() => onDigit('3'))}>3</button>
        <button className="btn btn-op" onClick={() => handleBtnClick(() => onOperator('+'))}>+</button>

        <button className="btn btn-num" onClick={() => handleBtnClick(onToggleSign)}>±</button>
        <button className="btn btn-num" onClick={() => handleBtnClick(() => onDigit('0'))}>0</button>
        <button className="btn btn-num" onClick={() => handleBtnClick(() => onDigit('.'))}>.</button>
        <button className="btn btn-equals" onClick={handleEqualsClick}>=</button>
      </div>
    </div>
  )
}
