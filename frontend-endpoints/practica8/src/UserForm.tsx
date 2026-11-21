import { useState } from "react";
import type { SubmitEvent } from "react";
import { textoDe } from "./types";
import type { NuevoUsuario, RespuestaAlta } from "./types";

// No hay endpoint de países: las opciones se escriben a mano
const PAISES = [
  { id: 1, nombre: "Argentina" },
  { id: 2, nombre: "Brasil" },
];

interface Mensaje {
  texto: string;
  exito: boolean;
}

interface UserFormProps {
  token: string;
  onCreated: () => void; // avisa a la lista que tiene que actualizarse
  onUnauthorized: () => void;
}

export function UserForm({ token, onCreated, onUnauthorized }: UserFormProps) {
  //bajo capot
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryId, setCountryId] = useState("1");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<Mensaje | null>(null);

  async function crearUsuario(evento: SubmitEvent) {
    evento.preventDefault();
    setMensaje(null);
    setEnviando(true);

    // age y country_id tienen que viajar como número
    const nuevo: NuevoUsuario = {
      name,
      age: Number(age),
      email,
      password,
      country_id: Number(countryId),
    };

    try {
      const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevo),
      });
      if (respuesta.status === 401) {
        onUnauthorized(); // la sesión venció: App cierra la sesión
        return;
      }
      const data: RespuestaAlta = await respuesta.json();
      if (!respuesta.ok) {
        setMensaje({
          texto: textoDe(data.detail, "No se pudo crear el usuario"),
          exito: false,
        });
        return;
      }
      setMensaje({
        texto: textoDe(data.message ?? data.detail, "Usuario creado"),
        exito: true,
      });
      setName("");
      setAge("");
      setEmail("");
      setPassword("");
      setCountryId("1");
      onCreated(); // la lista se vuelve a pedir, sin recargar la página
    } catch {
      setMensaje({ texto: "No se pudo completar la solicitud", exito: false });
    } finally {
      setEnviando(false);
    }
  }

  //carroceria
  return (
    <form className="alta" onSubmit={crearUsuario}>
      <h2>Nuevo usuario</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre"
        required
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Edad"
        min={0}
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        minLength={4}
        required
      />
      <select value={countryId} onChange={(e) => setCountryId(e.target.value)}>
        {PAISES.map((pais) => (
          <option key={pais.id} value={pais.id}>
            {pais.nombre}
          </option>
        ))}
      </select>
      <button type="submit" disabled={enviando}>
        Crear usuario
      </button>
      {mensaje && (
        <p className={mensaje.exito ? "mensaje exito" : "mensaje fallo"}>
          {mensaje.texto}
        </p>
      )}
    </form>
  );
}
