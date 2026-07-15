# StructChart

Aplicación web para diseñar y analizar **cartas de estructura** (structure charts) del diseño estructurado de software. Permite modelar módulos de control y subordinados, dibujar las conexiones entre ellos, describir los datos que se intercambian y obtener un **reporte de calidad** que evalúa el acoplamiento y el fan-out del diseño.

## Características

- **Editor visual de diagramas** basado en [React Flow](https://reactflow.dev/): agregar, mover y conectar módulos de forma interactiva.
- **Auto-layout jerárquico** con [dagre](https://github.com/dagrejs/dagre) para organizar automáticamente la carta de estructura.
- **Modelado de datos por conexión**: cada conexión describe los datos que viajan entre módulos, clasificados por naturaleza (elemental, estructura o bandera de control).
- **Análisis de acoplamiento automático**: clasifica cada conexión como acoplamiento de **datos**, de **sello** o de **control**, resaltando los indeseables.
- **Reporte de calidad** con métricas de fan-out, promedio, módulos con acoplamiento indeseable y observaciones por módulo.
- **Exportación** del diagrama como imagen y del reporte como texto.

## Arquitectura

El proyecto se organiza en tres partes:

```
StructChart/
├── backend/        API REST (Node.js + Express + Prisma)
├── frontend/       SPA (React + Vite + React Flow)
└── BaseDeDatos/    Dump SQL e instrucciones de restauración
```

### Stack tecnológico

| Capa      | Tecnologías                                                        |
|-----------|-------------------------------------------------------------------|
| Frontend  | React 18, Vite, React Router, React Flow, dagre, html-to-image    |
| Backend   | Node.js, Express, Prisma ORM                                       |
| Base de datos | MySQL 8                                                        |

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- [MySQL](https://www.mysql.com/) 8

## Puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/Near-dev-s/StructCharts.git
cd StructCharts
```

### 2. Configurar la base de datos

Consulta [BaseDeDatos/LEEME.md](BaseDeDatos/LEEME.md) para restaurar la base de datos desde el dump incluido. En resumen:

```bash
mysql -u root -p < BaseDeDatos/structchart_dump.sql
```

Esto crea la base `structchart` con sus tablas y datos de ejemplo.

### 3. Levantar el backend

```bash
cd backend
npm install
cp .env.example .env      # ajusta DATABASE_URL y PORT si es necesario
npm run prisma:generate
npm run dev
```

El backend queda escuchando en `http://localhost:4000`.

Variables de entorno (`backend/.env`):

```env
DATABASE_URL="mysql://structchart:structchart_pass@localhost:3306/structchart"
PORT=4000
```

### 4. Levantar el frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend queda disponible en `http://localhost:5173` y redirige las llamadas `/api` al backend mediante el proxy de Vite.

## Modelo de datos

| Tabla        | Descripción                                              |
|--------------|----------------------------------------------------------|
| `project`    | Proyectos (cada uno es una carta de estructura).         |
| `module`     | Módulos del proyecto: de control (`CONTROL`) o subordinados (`SUBORDINATE`). |
| `connection` | Conexiones entre módulos.                                |
| `dataitem`   | Datos intercambiados en cada conexión (elemental, estructura o bandera de control). |

## API REST

Base URL: `http://localhost:4000`

| Método | Ruta                                        | Descripción                       |
|--------|---------------------------------------------|-----------------------------------|
| GET    | `/health`                                   | Estado del servicio.              |
| GET    | `/api/projects`                             | Listar proyectos.                 |
| POST   | `/api/projects`                             | Crear proyecto.                   |
| GET    | `/api/projects/:id`                         | Obtener un proyecto.              |
| PUT    | `/api/projects/:id`                         | Actualizar proyecto.              |
| DELETE | `/api/projects/:id`                         | Eliminar proyecto.                |
| GET    | `/api/projects/:projectId/quality-report`   | Reporte de calidad del proyecto.  |
| —      | `/api/projects/:projectId/modules`          | Gestión de módulos del proyecto.  |
| —      | `/api/projects/:projectId/connections`      | Gestión de conexiones y sus datos.|

## Análisis de calidad

El reporte de calidad ([backend/src/lib/qualityReport.js](backend/src/lib/qualityReport.js)) evalúa cada diseño según reglas clásicas del diseño estructurado:

- **Acoplamiento** — según la naturaleza de los datos de cada conexión, prevaleciendo el más indeseable: control > sello > datos.
- **Fan-out** — un módulo que llama a más de ~7 subordinados sugiere que concentra demasiadas responsabilidades.
- **Módulos de control sin subordinados** — posibles conexiones faltantes por modelar.

## Scripts útiles

**Backend**

```bash
npm run dev              # servidor con recarga automática
npm start                # servidor en modo producción
npm run prisma:generate  # generar el cliente de Prisma
npm run prisma:migrate   # aplicar migraciones
```

**Frontend**

```bash
npm run dev       # servidor de desarrollo (Vite)
npm run build     # compilar para producción
npm run preview   # previsualizar la build
```
