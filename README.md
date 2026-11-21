# programacion4-react

Trabajo práctico de Programación 4 con **React + TypeScript + Vite**.

El repositorio tiene dos partes independientes. Cada carpeta es un proyecto completo, con su propio `package.json`, y se instala y se ejecuta por separado.

## Estructura

```
programacion4-react/
├── ejercicios-basicos/        Siete ejercicios de "React desde cero"
└── frontend-endpoints/
    ├── practica1/             Proyecto completo hasta la práctica 1
    ├── practica2/             ... hasta la práctica 2 (incluye la 1)
    ├── ...
    └── practica8/             ... hasta la práctica 8 (incluye todas las anteriores)
```

Las carpetas `practicaN` son **acumulativas**: cada una conserva todo lo resuelto en las anteriores y suma lo nuevo. La práctica 9 es una consigna de reflexión que se responde en el cuestionario, por eso no tiene carpeta.

## Requisitos

- **Node.js** `^20.19.0` o `>=22.12.0` (lo exige Vite 8) y npm.
- Para `frontend-endpoints`: el **backend** de la materia corriendo en `http://localhost:8000`. No está incluido en este repositorio.

## Ejercicios básicos

No necesitan backend ni variables de entorno.

```bash
cd ejercicios-basicos
npm install
npm run dev
```

Queda disponible en <http://localhost:5173>. `App.tsx` muestra los siete ejercicios, cada uno con su título:

| Archivo | Ejercicio |
|---|---|
| `src/Ej1.tsx` | 1. Tarjetas de producto |
| `src/Ej2.tsx` | 2. Contador con límites |
| `src/Ej3.tsx` | 3. Mostrar y ocultar |
| `src/Ej4.tsx` | 4. Conversor de temperatura |
| `src/Ej5.tsx` | 5. Lista de compras |
| `src/Ej6.tsx` | 6. Buscador |
| `src/Ej7.tsx` | 7. Tipar con TypeScript |

## Prácticas con endpoints

Elegí la práctica que quieras probar. Por ejemplo, la 8, que es la más completa:

```bash
cd frontend-endpoints/practica8
```

**1. Configurar la URL de la API.** Copiá el archivo de ejemplo a `.env` (el `.env` real no se sube al repositorio):

```bash
# macOS / Linux / Git Bash
cp .env.example .env

# Windows (cmd)
copy .env.example .env
```

El `.env.example` contiene la única variable necesaria. Ajustala si tu backend usa otra dirección:

```
VITE_API_URL=http://localhost:8000
```

**2. Instalar y ejecutar:**

```bash
npm install
npm run dev
```

Queda disponible en <http://localhost:5175>. El puerto es fijo: si está ocupado, Vite avisa en lugar de cambiar de puerto. Iniciá sesión con un usuario de prueba de tu backend (este repositorio no incluye credenciales).

### Qué suma cada práctica

| Práctica | Endpoint | Qué agrega |
|---|---|---|
| 1 | `GET /user/{id}` | Al hacer clic en un nombre, muestra email, edad, país y roles |
| 2 | (los anteriores) | Estados "Cargando..." y manejo de errores con `response.ok` y `detail` |
| 3 | `GET /user/search/{name}` | Búsqueda por nombre con `encodeURIComponent` y botón "Limpiar" |
| 4 | `GET /user/{id}` | Saludo con el nombre y los roles: "Hola, Martina (ADMIN)" |
| 5 | `POST /user` | Formulario de alta; la lista se actualiza sin recargar |
| 6 | `GET /user_mayores` | Botón para alternar entre "Todos" y "Solo mayores" |
| 7 | `DELETE /user/{id}` | Botón "Borrar" con confirmación y errores de la API (p. ej. 403) |
| 8 | (todos) | Sesión vencida: ante un 401 borra el token y vuelve al login con "Tu sesión venció" |

La práctica 8 además guarda el token en `localStorage`, para que la sesión sobreviva a una recarga, e incluye un botón "Cerrar sesión".

### Qué se asumió del backend

El enunciado no detalla algunas respuestas de la API, así que el código se escribió de forma tolerante. Si tu backend responde distinto, estos son los puntos a ajustar:

- **Id del usuario logueado** (práctica 4 en adelante): `src/auth.ts` lo busca en la respuesta de `POST /login` (`user_id` o `id`) y, si no está, dentro del token si es un JWT (`user_id`, `id` o `sub`). Si no lo encuentra, muestra "No se pudo identificar al usuario".
- **País y roles** en `GET /user/{id}`: se aceptan como texto (`"Argentina"`, `["ADMIN"]`) o como objetos con `name`.
- **Mensaje del alta** (práctica 5): se lee del campo `message`; si no existe, muestra "Usuario creado".

## Otros comandos

Dentro de cualquier proyecto:

```bash
npm run build     # verifica los tipos con tsc y genera la versión de producción
npm run lint      # revisa el código con oxlint
npm run preview   # sirve la versión de producción generada
```

## Seguridad

- No se versionan `node_modules`, `dist` ni archivos `.env`; solo `.env.example`.
- El código no contiene credenciales ni tokens.
