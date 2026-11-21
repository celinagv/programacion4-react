// Ejercicio 2: Contador con límites (useState)
import { useState } from 'react'

const MINIMO = 0
const MAXIMO = 10

export default function Ej2() {
  const [valor, setValor] = useState(MINIMO)

  function sumar() {
    if (valor < MAXIMO) setValor(valor + 1)
  }

  function restar() {
    if (valor > MINIMO) setValor(valor - 1)
  }

  function reiniciar() {
    setValor(MINIMO)
  }

  return (
    <div>
      <p className="contador">{valor}</p>
      <button onClick={restar} disabled={valor === MINIMO}>
        −
      </button>{' '}
      <button onClick={sumar} disabled={valor === MAXIMO}>
        +
      </button>{' '}
      <button onClick={reiniciar}>Reiniciar</button>
      {valor === MAXIMO && <p>Llegaste al máximo</p>}
    </div>
  )
}
