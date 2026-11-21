import { useEffect, useState } from "react";
import { nombreDe } from "./types";
import type { UserDetailData } from "./types";

interface SaludoProps {
  id: number;
  token: string;
}

export function Saludo({ id, token }: SaludoProps) {
  //bajo capot
  const [user, setUser] = useState<UserDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarUsuario() {
      try {
        const respuesta = await fetch(
          `${import.meta.env.VITE_API_URL}/user/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await respuesta.json();
        if (!respuesta.ok) {
          setError(data.detail);
          return;
        }
        setUser(data);
      } catch {
        setError("No se pudo completar la solicitud");
      } finally {
        setLoading(false);
      }
    }

    cargarUsuario();
  }, [id, token]);

  //carroceria
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return null;

  // Ejemplo: Hola, Martina (ADMIN)
  const roles = user.roles.map(nombreDe).join(", ");

  return (
    <h1 className="saludo">
      Hola, {user.name}
      {roles !== "" && ` (${roles})`}
    </h1>
  );
}
