import { useEffect, useState } from "react";

// Tipo de dato que puede venir como texto o como objeto con nombre
type ConNombre = string | { name: string };

interface UserDetailData {
  id: number;
  name: string;
  email: string;
  age: number;
  country: ConNombre;
  roles: ConNombre[];
}

function nombreDe(valor: ConNombre): string {
  return typeof valor === "string" ? valor : valor.name;
}

interface UserDetailProps {
  id: number;
  token: string;
}

export function UserDetail({ id, token }: UserDetailProps) {
  //bajo capot
  const [user, setUser] = useState<UserDetailData | null>(null);

  // Se vuelve a pedir el detalle cada vez que cambia el id elegido
  useEffect(() => {
    let cancelado = false; // evita mostrar la respuesta de un clic anterior

    fetch(`${import.meta.env.VITE_API_URL}/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      if (!respuesta.ok) return; // los errores se manejan en la práctica 2
      const data: UserDetailData = await respuesta.json();
      if (!cancelado) setUser(data);
    });

    return () => {
      cancelado = true;
    };
  }, [id, token]);

  //carroceria
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
