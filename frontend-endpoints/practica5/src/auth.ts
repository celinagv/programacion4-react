// Averigua el id del usuario que inició sesión.
// No sabemos con certeza qué devuelve POST /login, así que se busca en dos
// lugares: primero en la respuesta del login y después dentro del token (JWT).
// Si el backend lo entrega de otra forma, este es el único archivo a ajustar.

function leerPayload(token: string): Record<string, unknown> {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return {}; // el token no es un JWT
  }
}

export function obtenerUserId(
  respuestaLogin: Record<string, unknown>,
  token: string,
): number | null {
  const payload = leerPayload(token);
  const candidato =
    respuestaLogin.user_id ??
    respuestaLogin.id ??
    payload.user_id ??
    payload.id ??
    payload.sub;
  const id = Number(candidato);
  return Number.isInteger(id) && id > 0 ? id : null;
}
