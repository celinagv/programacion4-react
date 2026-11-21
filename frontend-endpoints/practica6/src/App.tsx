import { useState } from "react";
import type { SubmitEvent } from "react";
import { UserList } from "./UserList";
import { Saludo } from "./Saludo";
import { obtenerUserId } from "./auth";

export default function App() {
  //bajo capot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

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
    setUserId(obtenerUserId(data, data.token));
    setToken(data.token);
  }

  //carroceria
  if (token) {
    return (
      <>
        {userId !== null ? (
          <Saludo id={userId} token={token} />
        ) : (
          <p>No se pudo identificar al usuario</p>
        )}
        <UserList token={token} />
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
