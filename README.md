# Six Pack Store

Proyecto de ejemplo: tienda en línea para venta de cervezas (frontend React + backend Express + MariaDB).

## Contenido

- `frontend/` — Aplicación React (cliente)
- `backend/` — API en Express (servidor) y conexión a MariaDB
- `package.json` — (raíz) nota: proyectos separados tienen sus propios `package.json`

## Requisitos

- Node.js (recomendado 16.x o superior)
- npm (o pnpm/yarn si lo prefieres)
- Una instancia de MariaDB accesible (local o remota)

## Variables de entorno (backend)

Crea un archivo `.env` dentro de `backend/` con estas variables (ejemplo):

```
# puerto del servidor (por defecto 5000)
PORT=5000

# URL del cliente permitida por CORS
CLIENT_URL=http://localhost:3000

# Base de datos (MariaDB)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nombre_basedatos
DB_USER=usuario
DB_PASS=contraseña
```

Asegúrate de ajustar `DB_*` con tus credenciales.

## Instalación y ejecución (desarrollo)

Abrir dos terminales (uno para backend y otro para frontend). En PowerShell:

Terminal 1 — Backend:

```powershell
cd C:\Users\enriq\Desktop\six-pack-store\backend
npm install
npm run dev    # usa nodemon (recomendado durante desarrollo)
# o
npm start      # iniciar sin nodemon
```

Terminal 2 — Frontend:

```powershell
cd C:\Users\enriq\Desktop\six-pack-store\frontend
npm install
npm start
```

- El frontend por defecto corre en `http://localhost:3000`.
- El backend por defecto corre en `http://localhost:5000` (puede cambiar con `PORT` en `.env`).

## Build para producción (frontend)

```powershell
cd C:\Users\enriq\Desktop\six-pack-store\frontend
npm run build
```

Esto generará la carpeta `build/` lista para servir (por ejemplo con un servidor estático o un servicio de hosting).

## Endpoints principales (API)

Algunos endpoints expuestos por el backend:

- `GET /api/productos` — lista de productos activos
- `GET /api/productos/:id` — detalle de producto
- `GET /api/productos/categoria/:id` — productos por categoría
- `POST /api/productos` — crear producto (admin)
- `PUT /api/productos/:id` — actualizar producto (admin)
- `DELETE /api/productos/:id` — eliminar producto (soft delete)
- `GET /api/categorias` — listar categorías
- `POST /api/pedidos` — crear pedido
- `GET /api/pedidos` — listar pedidos (admin)

## Notas importantes y solución de problemas

- Si el backend no puede conectarse a la base de datos, revisa las variables `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASS` en `backend/.env`.
- CORS: el backend permite por defecto `http://localhost:3000` o el valor de `CLIENT_URL`.
- Si ves warnings de Webpack Dev Server sobre `onBeforeSetupMiddleware`/`onAfterSetupMiddleware`, son advertencias deprecadas y no rompen la aplicación; se pueden ignorar por ahora.
- Para debugging en desarrollo del frontend, abre la consola del navegador y revisa peticiones a `http://localhost:5000`.

## Sugerencias para despliegue

- Genera el `build` del frontend y sirve su contenido estático desde un servidor (Nginx, Netlify, Vercel, etc.). Si decides servir el `build` desde Express, añade un middleware estático en `backend` que sirva la carpeta `frontend/build`.
- Protege las credenciales de base de datos y usa variables de entorno en el host/CI.

## Contribuir

- Haz un fork y un PR con tus cambios. Mantén código claro y comenta cambios importantes.

## Licencia

Este repositorio no incluye una licencia explícita; añádela si planeas publicar o compartir.

---

Si quieres, puedo añadir un archivo `backend/.env.example` con el contenido mostrado arriba, o automatizar un `npm run dev` paralelo con `concurrently`. ¿Quieres que lo haga?