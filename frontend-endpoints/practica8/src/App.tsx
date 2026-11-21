import { useCallback, useState } from "react";
import type { SubmitEvent } from "react";
import { UserList } from "./UserList";
import { Saludo } from "./Saludo";
import { obtenerUserId } from "./auth";

export default function App() {
  //bajo capot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  // La sesión se guarda en localStorage para que sobreviva a una recarga
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );
  const [userId, setUserId] = useState<number | null>(() => {
    const guardado = localStorage.getItem("userId");
    return guardado ? Number(guardado) : null;
  });

  async function handleSubmit(evento: SubmitEvent) {
    evento?.preventDefault();
    setError(null);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.detail);
      return;
    }
    const id = obtenerUserId(data, data.token);
    localStorage.setItem("token", data.token);
    if (id !== null) localStorage.setItem("userId", String(id));
    setUserId(id);
    setToken(data.token);
  }

  // Cierra la sesión: borra el token y vuelve al login (con un aviso opcional)
  const cerrarSesion = useCallback((aviso?: string) => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setUserId(null);
    setError(aviso ?? null);
  }, []);

  // Se la pasamos a los componentes que hacen pedidos: si alguno recibe un
  // 401, avisan a App con esta función
  const onUnauthorized = useCallback(
    () => cerrarSesion("Tu sesión venció"),
    [cerrarSesion],
  );

  //carroceria
  if (token) {
    return (
      <>
        {userId !== null ? (
          <Saludo id={userId} token={token} onUnauthorized={onUnauthorized} />
        ) : (
          <p>No se pudo identificar al usuario</p>
        )}
        <button type="button" onClick={() => cerrarSesion()}>
          Cerrar sesión
        </button>
        <UserList token={token} onUnauthorized={onUnauthorized} />
      </>
    );
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Ingresar</button>
      {error && <p>{error}</p>}
    </form>
  );
}
