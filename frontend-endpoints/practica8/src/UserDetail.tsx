import { useEffect, useState } from "react";
import { nombreDe } from "./types";
import type { UserDetailData } from "./types";

interface UserDetailProps {
  id: number;
  token: string;
  onUnauthorized: () => void;
}

export function UserDetail({ id, token, onUnauthorized }: UserDetailProps) {
  //bajo capot
  const [user, setUser] = useState<UserDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Se vuelve a pedir el detalle cada vez que cambia el id elegido
  useEffect(() => {
    let cancelado = false; // evita mostrar la respuesta de un clic anterior

    async function cargarDetalle() {
      setLoading(true);
      setError(null);
      try {
        const respuesta = await fetch(
          `${import.meta.env.VITE_API_URL}/user/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (respuesta.status === 401) {
          onUnauthorized(); // la sesión venció: App cierra la sesión
          return;
        }
        const data = await respuesta.json();
        if (cancelado) return;
        if (!respuesta.ok) {
          setError(data.detail);
          return;
        }
        setUser(data);
      } catch {
        if (!cancelado) setError("No se pudo completar la solicitud");
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    cargarDetalle();

    return () => {
      cancelado = true;
    };
  }, [id, token, onUnauthorized]);

  //carroceria
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  // Si todavía está el detalle de otro usuario, no se muestra
  if (!user || user.id !== id) return null;

  return (
    <div className="detalle">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Edad: {user.age}</p>
      <p>País: {nombreDe(user.country)}</p>
      <p>Roles: {user.roles.map(nombreDe).join(", ")}</p>
    </div>
  );
}
