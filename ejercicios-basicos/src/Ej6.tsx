// Ejercicio 6: Buscador (Filtrado)
import { useState } from 'react'

const LENGUAJES = [
  'JavaScript',
  'Java',
  'Python',
  'TypeScript',
  'C#',
  'Go',
  'Rust',
  'PHP',
  'Kotlin',
  'Swift',
]

export default function Ej6() {
  const [busqueda, setBusqueda] = useState('')

  // La lista filtrada se calcula en cada renderizado: no necesita estado propio
  const resultados = LENGUAJES.filter((lenguaje) =>
    lenguaje.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div>
      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar lenguaje"
      />
      <p>
        {resultados.length} {resultados.length === 1 ? 'resultado' : 'resultados'}
      </p>
      <ul>
        {resultados.map((lenguaje) => (
          <li key={lenguaje}>{lenguaje}</li>
        ))}
      </ul>
    </div>
  )
}
