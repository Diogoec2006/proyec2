/**
 * Motor de cálculo matemático seguro para la Calculadora React
 * Incluye soporte para aritmética básica, funciones científicas, memoria y formateo limpio.
 */

// Formatear números para evitar problemas de precisión flotante en JS (ej. 0.1 + 0.2)
export function formatResult(value, precision = 12) {
  if (value === null || value === undefined || isNaN(value)) {
    return 'Error'
  }
  if (!isFinite(value)) {
    return value > 0 ? 'Infinito' : '-Infinito'
  }
  
  // Limitar precisión para remover artefactos binarios
  const factor = Math.pow(10, precision)
  const rounded = Math.round((value + Number.EPSILON) * factor) / factor

  // Si es un número extremadamente grande o pequeño, usar notación científica
  if (Math.abs(rounded) >= 1e12 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 1e-7)) {
    return rounded.toExponential(6).replace('e+', 'e')
  }

  // Convertir a string evitando ceros decimales innecesarios
  return String(rounded)
}

// Calcular factorial
export function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN
  if (n === 0 || n === 1) return 1
  if (n > 170) return Infinity // Límite de flotantes de 64 bits en JS
  let res = 1
  for (let i = 2; i <= n; i++) {
    res *= i
  }
  return res
}

/**
 * Tokenizador y evaluador seguro basado en Dijkstra Shunting-Yard
 */
export function evaluateExpression(expression) {
  if (!expression || typeof expression !== 'string') return 0

  // Limpiar y normalizar la expresión
  let sanitized = expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, String(Math.PI))
    .replace(/\be\b/g, String(Math.E))
    .trim()

  if (!sanitized) return 0

  try {
    const tokens = tokenize(sanitized)
    const rpn = shuntingYard(tokens)
    const result = evaluateRPN(rpn)
    return result
  } catch (err) {
    throw new Error(err.message || 'Error en la expresión')
  }
}

// Tokenizar la cadena matemática
function tokenize(str) {
  const tokens = []
  let i = 0

  while (i < str.length) {
    const char = str[i]

    if (/\s/.test(char)) {
      i++
      continue
    }

    // Números (enteros o decimales)
    if (/[0-9.]/.test(char)) {
      let num = ''
      while (i < str.length && /[0-9.]/.test(str[i])) {
        num += str[i]
        i++
      }
      tokens.push({ type: 'number', value: parseFloat(num) })
      continue
    }

    // Nombres de funciones (sin, cos, tan, sqrt, log, ln, fact, abs)
    if (/[a-zA-Z]/.test(char)) {
      let name = ''
      while (i < str.length && /[a-zA-Z0-9]/.test(str[i])) {
        name += str[i]
        i++
      }
      tokens.push({ type: 'function', value: name.toLowerCase() })
      continue
    }

    // Operadores
    if ('+-*/%^'.includes(char)) {
      // Diferenciar signo negativo unitario de resta
      const prev = tokens[tokens.length - 1]
      const isUnaryMinus = char === '-' && (!prev || prev.type === 'operator' || (prev.type === 'paren' && prev.value === '('))

      if (isUnaryMinus) {
        tokens.push({ type: 'unary', value: 'u-' })
      } else {
        tokens.push({ type: 'operator', value: char })
      }
      i++
      continue
    }

    // Paréntesis
    if (char === '(' || char === ')') {
      tokens.push({ type: 'paren', value: char })
      i++
      continue
    }

    // Carácter no reconocido
    throw new Error(`Símbolo inválido: ${char}`)
  }

  return tokens
}

const PRECEDENCE = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '%': 2,
  '^': 3,
  'u-': 4
}

const ASSOCIATIVITY = {
  '+': 'L',
  '-': 'L',
  '*': 'L',
  '/': 'L',
  '%': 'L',
  '^': 'R',
  'u-': 'R'
}

// Algoritmo Shunting-yard para convertir tokens infijos a Notación Polaca Inversa (RPN)
function shuntingYard(tokens) {
  const output = []
  const opStack = []

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    if (token.type === 'number') {
      output.push(token)
    } else if (token.type === 'function') {
      opStack.push(token)
    } else if (token.type === 'operator' || token.type === 'unary') {
      const op1 = token.value
      while (opStack.length > 0) {
        const top = opStack[opStack.length - 1]
        if (top.type === 'paren' && top.value === '(') break

        const op2 = top.value
        const p1 = PRECEDENCE[op1] || 0
        const p2 = PRECEDENCE[op2] || 0

        if ((ASSOCIATIVITY[op1] === 'L' && p1 <= p2) || (ASSOCIATIVITY[op1] === 'R' && p1 < p2)) {
          output.push(opStack.pop())
        } else {
          break
        }
      }
      opStack.push(token)
    } else if (token.type === 'paren') {
      if (token.value === '(') {
        opStack.push(token)
      } else if (token.value === ')') {
        let foundOpen = false
        while (opStack.length > 0) {
          const top = opStack.pop()
          if (top.type === 'paren' && top.value === '(') {
            foundOpen = true
            break
          }
          output.push(top)
        }
        if (!foundOpen) {
          throw new Error('Paréntesis no emparejados')
        }
        if (opStack.length > 0 && opStack[opStack.length - 1].type === 'function') {
          output.push(opStack.pop())
        }
      }
    }
  }

  while (opStack.length > 0) {
    const top = opStack.pop()
    if (top.type === 'paren') {
      throw new Error('Paréntesis desbalanceados')
    }
    output.push(top)
  }

  return output
}

// Evaluar RPN
function evaluateRPN(rpn) {
  const stack = []

  for (let i = 0; i < rpn.length; i++) {
    const token = rpn[i]

    if (token.type === 'number') {
      stack.push(token.value)
    } else if (token.type === 'unary' && token.value === 'u-') {
      if (stack.length < 1) throw new Error('Expresión incompleta')
      const val = stack.pop()
      stack.push(-val)
    } else if (token.type === 'operator') {
      if (stack.length < 2) throw new Error('Expresión incompleta')
      const b = stack.pop()
      const a = stack.pop()

      switch (token.value) {
        case '+':
          stack.push(a + b)
          break
        case '-':
          stack.push(a - b)
          break
        case '*':
          stack.push(a * b)
          break
        case '/':
          if (b === 0) throw new Error('División por cero')
          stack.push(a / b)
          break
        case '%':
          stack.push(a % b)
          break
        case '^':
          stack.push(Math.pow(a, b))
          break
        default:
          throw new Error(`Operador desconocido: ${token.value}`)
      }
    } else if (token.type === 'function') {
      if (stack.length < 1) throw new Error('Argumento faltante para función')
      const val = stack.pop()

      switch (token.value) {
        case 'sin':
          stack.push(Math.sin((val * Math.PI) / 180)) // En grados para intuición de calculadora
          break
        case 'cos':
          stack.push(Math.cos((val * Math.PI) / 180))
          break
        case 'tan':
          stack.push(Math.tan((val * Math.PI) / 180))
          break
        case 'sqrt':
          if (val < 0) throw new Error('Raíz de número negativo')
          stack.push(Math.sqrt(val))
          break
        case 'log':
          if (val <= 0) throw new Error('Logaritmo no definido')
          stack.push(Math.log10(val))
          break
        case 'ln':
          if (val <= 0) throw new Error('Ln no definido')
          stack.push(Math.log(val))
          break
        case 'abs':
          stack.push(Math.abs(val))
          break
        case 'fact':
          stack.push(factorial(val))
          break
        default:
          throw new Error(`Función desconocida: ${token.value}`)
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error('Sintaxis matemática inválida')
  }

  return stack[0]
}

// Reproductor de sonido sintetizado con Web Audio API (ligero, sin archivos mp3)
export class SoundEffects {
  constructor() {
    this.ctx = null
    this.enabled = true
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
  }

  playClick() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      if (this.ctx.state === 'suspended') {
        this.ctx.resume()
      }
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04)

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.04)
    } catch {
      // Ignorar si el navegador bloquea audio sin interacción
    }
  }

  playEquals() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      if (this.ctx.state === 'suspended') {
        this.ctx.resume()
      }
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(440, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.08)
    } catch {}
  }
}

