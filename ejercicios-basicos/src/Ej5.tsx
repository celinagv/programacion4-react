// Ejercicio 5: Lista de compras (Listas y estado)
import { useState } from 'react'

interface Item {
  id: number
  texto: string
}

export default function Ej5() {
  const [texto, setTexto] = useState('')
  const [items, setItems] = useState<Item[]>([])

  function agregar() {
    const textoLimpio = texto.trim()
    if (textoLimpio === '') return // no se permiten ítems vacíos

    const nuevo: Item = { id: Date.now(), texto: textoLimpio }
    setItems([...items, nuevo]) // array nuevo, nunca push
    setTexto('')
  }

  function eliminar(id: number) {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div>
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Ej: yerba"
      />{' '}
      <button onClick={agregar}>Agregar</button>

      {items.length === 0 ? (
        <p>No hay nada para comprar</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.texto}{' '}
              <button onClick={() => eliminar(item.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
