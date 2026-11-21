import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { UserDetail } from "./UserDetail";
import { UserForm } from "./UserForm";

interface User {
  id: number;
  name: string;
}

export function UserList({ token }: { token: string }) {
  //bajo capot
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState(""); // lo que se escribe en el input
  const [termino, setTermino] = useState(""); // lo que se buscó al apretar Buscar
  const [version, setVersion] = useState(0); // sube cuando hay que recargar la lista

  // Se vuelve a pedir la lista cuando cambia el término buscado o se crea un usuario
  useEffect(() => {
    let cancelado = false; // evita mostrar la respuesta de una búsqueda anterior

    async function cargarUsuarios() {
      setLoading(true);
      setError(null);
      // Sin término se pide la lista completa; con término, la búsqueda
      const ruta =
        termino === "" ? "/user" : `/user/search/${encodeURIComponent(termino)}`;
      try {
        const respuesta = await fetch(
          `${import.meta.env.VITE_API_URL}${ruta}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await respuesta.json();
        if (cancelado) return;
        if (!respuesta.ok) {
          setError(data.detail); // 401, 403…: viene un objeto { detail }
          return;
        }
        setUsers(data); // 200: recién acá es una lista
      } catch {
        // Sin conexión o respuesta que no es JSON
        if (!cancelado) setError("No se pudo completar la solicitud");
      } finally {
        if (!cancelado) setLoading(false); // termina bien o mal
      }
    }

    cargarUsuarios();

    return () => {
      cancelado = true;
    };
  }, [token, termino, version]);

  function buscar(evento: SubmitEvent) {
    evento.preventDefault();
    setTermino(busqueda.trim()); // si queda vacío, se pide la lista completa
  }

  function limpiar() {
    setBusqueda("");
    setTermino("");
  }

  //carroceria
  return (
    <>
      <UserForm token={token} onCreated={() => setVersion(version + 1)} />

      <form onSubmit={buscar}>
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre"
        />{" "}
        <button type="submit">Buscar</button>{" "}
        <button type="button" onClick={limpiar}>
          Limpiar
        </button>
      </form>

      {loading && <p>Cargando...</p>}
      {!loading && error && <p>{error}</p>}
      {!loading && !error && users.length === 0 && (
        <p>No se encontraron usuarios</p>
      )}
      {!loading && !error && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <button
                className={user.id === selectedId ? "nombre elegido" : "nombre"}
                onClick={() => setSelectedId(user.id)}
              >
                {user.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedId !== null && <UserDetail id={selectedId} token={token} />}
    </>
  );
}
