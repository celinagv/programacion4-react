import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { UserDetail } from "./UserDetail";
import { UserForm } from "./UserForm";
import { textoDe } from "./types";

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
  const [soloMayores, setSoloMayores] = useState(false); // Todos / Solo mayores
  const [errorBorrado, setErrorBorrado] = useState<string | null>(null);
  const [borrandoId, setBorrandoId] = useState<number | null>(null);

  // Se vuelve a pedir la lista cuando cambia el filtro, el término buscado
  // o se crea un usuario
  useEffect(() => {
    let cancelado = false; // evita mostrar la respuesta de una búsqueda anterior

    async function cargarUsuarios() {
      setLoading(true);
      setError(null);
      // Solo mayores, búsqueda por nombre o lista completa
      let ruta = "/user";
      if (soloMayores) {
        ruta = "/user_mayores";
      } else if (termino !== "") {
        ruta = `/user/search/${encodeURIComponent(termino)}`;
      }
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
  }, [token, termino, version, soloMayores]);

  function buscar(evento: SubmitEvent) {
    evento.preventDefault();
    setTermino(busqueda.trim()); // si queda vacío, se pide la lista completa
  }

  function limpiar() {
    setBusqueda("");
    setTermino("");
  }

  async function borrar(user: User) {
    if (!window.confirm(`¿Seguro que querés borrar a ${user.name}?`)) return;

    setErrorBorrado(null);
    setBorrandoId(user.id);
    try {
      const respuesta = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${user.id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
      );
      if (!respuesta.ok) {
        // Ej.: 403 "Missing permission: delete_users"
        const data = await respuesta.json().catch(() => null);
        setErrorBorrado(textoDe(data?.detail, "No se pudo borrar el usuario"));
        return;
      }
      // Salió bien: se saca de la lista sin volver a pedirla
      setUsers(users.filter((u) => u.id !== user.id));
      if (selectedId === user.id) setSelectedId(null); // cierra su detalle
    } catch {
      setErrorBorrado("No se pudo completar la solicitud");
    } finally {
      setBorrandoId(null);
    }
  }

  function alternarMayores() {
    // /user_mayores no admite búsqueda: al cambiar de vista se limpia
    setBusqueda("");
    setTermino("");
    setSoloMayores(!soloMayores);
  }

  //carroceria
  return (
    <>
      <UserForm token={token} onCreated={() => setVersion(version + 1)} />

      <p>
        Mostrando: <strong>{soloMayores ? "Solo mayores" : "Todos"}</strong>{" "}
        <button type="button" onClick={alternarMayores}>
          {soloMayores ? "Mostrar todos" : "Mostrar solo mayores"}
        </button>
      </p>

      <form onSubmit={buscar}>
        {/* En "Solo mayores" la búsqueda no está disponible */}
        <fieldset disabled={soloMayores}>
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre"
          />{" "}
          <button type="submit">Buscar</button>{" "}
          <button type="button" onClick={limpiar}>
            Limpiar
          </button>
        </fieldset>
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
              </button>{" "}
              <button
                className="borrar"
                onClick={() => borrar(user)}
                disabled={borrandoId === user.id}
              >
                Borrar
              </button>
            </li>
          ))}
        </ul>
      )}
      {errorBorrado && <p className="mensaje fallo">{errorBorrado}</p>}

      {selectedId !== null && <UserDetail id={selectedId} token={token} />}
    </>
  );
}
