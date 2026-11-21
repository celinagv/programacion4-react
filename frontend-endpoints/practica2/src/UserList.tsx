import { useEffect, useState } from "react";
import { UserDetail } from "./UserDetail";

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

  useEffect(() => {
    async function cargarUsuarios() {
      try {
        const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await respuesta.json();
        if (!respuesta.ok) {
          setError(data.detail); // 401, 403…: viene un objeto { detail }
          return;
        }
        setUsers(data); // 200: recién acá es una lista
      } catch {
        // Sin conexión o respuesta que no es JSON
        setError("No se pudo completar la solicitud");
      } finally {
        setLoading(false); // termina bien o mal
      }
    }

    cargarUsuarios();
  }, [token]);

  //carroceria
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
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

      {selectedId !== null && <UserDetail id={selectedId} token={token} />}
    </>
  );
}
