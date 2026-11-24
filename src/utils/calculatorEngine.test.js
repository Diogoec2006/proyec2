import { describe, it, expect } from 'vitest'
import { evaluateExpression, formatResult, factorial } from './calculatorEngine'

describe('Motor Matemático de la Calculadora', () => {
  describe('Operaciones Básicas', () => {
    it('debe sumar números correctamente', () => {
      expect(evaluateExpression('5 + 3')).toBe(8)
      expect(evaluateExpression('0.1 + 0.2')).toBeCloseTo(0.3)
    })

    it('debe restar correctamente y manejar negativos', () => {
      expect(evaluateExpression('10 - 4')).toBe(6)
      expect(evaluateExpression('-5 + 3')).toBe(-2)
      expect(evaluateExpression('5 - -3')).toBe(8)
    })

    it('debe multiplicar y respetar la precedencia de operadores', () => {
      expect(evaluateExpression('2 + 3 * 4')).toBe(14)
      expect(evaluateExpression('(2 + 3) * 4')).toBe(20)
    })

    it('debe dividir correctamente y lanzar error en división por cero', () => {
      expect(evaluateExpression('20 / 4')).toBe(5)
      expect(() => evaluateExpression('10 / 0')).toThrow('División por cero')
    })

    it('debe calcular módulo y potencias', () => {
      expect(evaluateExpression('10 % 3')).toBe(1)
      expect(evaluateExpression('2 ^ 3')).toBe(8)
    })
  })

  describe('Funciones Científicas', () => {
    it('debe calcular raíces cuadradas', () => {
      expect(evaluateExpression('sqrt(16)')).toBe(4)
      expect(evaluateExpression('sqrt(25) + 5')).toBe(10)
      expect(() => evaluateExpression('sqrt(-4)')).toThrow('Raíz de número negativo')
    })

    it('debe calcular funciones trigonométricas en grados', () => {
      expect(evaluateExpression('sin(90)')).toBeCloseTo(1)
      expect(evaluateExpression('cos(0)')).toBeCloseTo(1)
    })

    it('debe calcular logaritmos', () => {
      expect(evaluateExpression('log(100)')).toBe(2)
      expect(evaluateExpression('ln(e)')).toBeCloseTo(1)
    })

    it('debe calcular factoriales', () => {
      expect(factorial(5)).toBe(120)
      expect(evaluateExpression('fact(4)')).toBe(24)
    })
  })

  describe('Formateador de resultados', () => {
    it('debe formatear números flotantes limpiamente', () => {
      expect(formatResult(0.1 + 0.2)).toBe('0.3')
      expect(formatResult(1000)).toBe('1000')
      expect(formatResult(Infinity)).toBe('Infinito')
      expect(formatResult(-Infinity)).toBe('-Infinito')
      expect(formatResult(NaN)).toBe('Error')
    })
  })
})

