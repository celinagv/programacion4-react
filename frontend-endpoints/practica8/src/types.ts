// Tipos compartidos por los componentes que leen GET /user/{id}

// País o rol: puede venir como texto o como objeto con nombre
export type ConNombre = string | { name: string };

export interface UserDetailData {
  id: number;
  name: string;
  email: string;
  age: number;
  country: ConNombre;
  roles: ConNombre[];
}

export function nombreDe(valor: ConNombre): string {
  return typeof valor === "string" ? valor : valor.name;
}

// Devuelve el valor si es un texto; si no (por ejemplo un detail con otro
// formato), usa el texto por defecto
export function textoDe(valor: unknown, porDefecto: string): string {
  return typeof valor === "string" && valor !== "" ? valor : porDefecto;
}

// Cuerpo de POST /user
export interface NuevoUsuario {
  name: string;
  age: number;
  email: string;
  password: string;
  country_id: number;
}

// Respuesta de POST /user: un mensaje si salió bien, un detail si falló
export interface RespuestaAlta {
  message?: unknown;
  detail?: unknown;
}
