// Ejercicio 4: Conversor de temperatura (Inputs controlados)
import { useState } from 'react'

export default function Ej4() {
  // El valor de un input siempre es texto
  const [celsius, setCelsius] = useState('')

  // Fahrenheit no necesita estado propio: se calcula en cada renderizado
  const celsiusNumero = Number(celsius)
  const fahrenheit = (celsiusNumero * 9) / 5 + 32
  const hayValor = celsius !== ''

  return (
    <div>
      <input
        type="number"
        value={celsius}
        onChange={(e) => setCelsius(e.target.value)}
        placeholder="Grados Celsius"
      />
      {hayValor && (
        <>
          <p className="resultado">{fahrenheit.toFixed(1)} °F</p>
          {celsiusNumero > 30 && <p>Hace calor</p>}
        </>
      )}
    </div>
  )
}
