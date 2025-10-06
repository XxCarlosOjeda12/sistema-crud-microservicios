# Sistema de Microservicios CRUD - Reto Técnico Fullstack

## 📋 Descripción

Sistema de gestión de startups y tecnologías emergentes construido con arquitectura de microservicios desacoplados. Cada operación CRUD se implementa como un microservicio independiente, expuestos a través de un API Gateway Nginx, con frontend React responsivo.

**Dominios:** Startups y Tecnologías Emergentes  
**Microservicios:** 8 servicios independientes (4 por dominio)  
**Gateway:** Nginx como reverse proxy  
**Base de datos:** PostgreSQL compartida  
**Frontend:** React con tema claro/oscuro

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                    http://localhost:3001                         │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ HTTP Requests
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Nginx)                           │
│                    http://localhost:3000                         │
│                    /v1/api/startups/*                            │
│                    /v1/api/technologies/*                        │
└──────┬──────────────┬─────────────┬──────────────┬──────────────┘
       │              │             │              │
       │              │             │              │
   ┌───▼───┐      ┌───▼───┐    ┌───▼───┐      ┌───▼───┐
   │Create │      │ Read  │    │Update │      │Delete │
   │:3011  │      │:3012  │    │:3013  │      │:3014  │
   └───┬───┘      └───┬───┘    └───┬───┘      └───┬───┘
       │              │             │              │
       └──────────────┴─────────────┴──────────────┘
                      │
              ┌───────▼────────┐
              │   PostgreSQL   │
              │   :5432        │
              │                │
              │  - startups    │
              │  - technologies│
              └────────────────┘

STARTUPS MICROSERVICES:
- CreateStartupService  (port 3011)
- ReadStartupService    (port 3012)
- UpdateStartupService  (port 3013)
- DeleteStartupService  (port 3014)

TECHNOLOGIES MICROSERVICES:
- CreateTechnologyService  (port 3021)
- ReadTechnologyService    (port 3022)
- UpdateTechnologyService  (port 3023)
- DeleteTechnologyService  (port 3024)
```

---

## 📁 Estructura del Proyecto

```
reto1/
├── gateway/
│   ├── nginx.conf
│   └── Dockerfile
├── services/
│   ├── startups/
│   │   ├── create/
│   │   │   ├── index.js
│   │   │   ├── package.json
│   │   │   └── Dockerfile
│   │   ├── read/
│   │   ├── update/
│   │   └── delete/
│   └── technologies/
│       ├── create/
│       ├── read/
│       ├── update/
│       └── delete/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          (Modal, Alert, Spinner, etc.)
│   │   │   ├── Startups/        (Lista, Tabla, Filtros, Form)
│   │   │   └── Technologies/    (Lista, Grid, Filtros, Form)
│   │   ├── hooks/               (useTheme, useForm, useApiCall)
│   │   ├── utils/               (validators, formatters)
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── Dockerfile
├── db/
│   └── init.sql
├── capturas/
│   └── postman/                 (Evidencia de pruebas)
├── docker-compose.yml
├── Microservices_CRUD_Collection.postman.json
├── .env.example
└── README.md
```

---

## 🛠️ Stack Tecnológico

### Backend
- **Runtime:** Node.js 18
- **Framework:** Express.js
- **Base de datos:** PostgreSQL 15
- **ORM/Cliente:** pg (node-postgres)
- **Gateway:** Nginx (reverse proxy)
- **Contenedores:** Docker + Docker Compose

### Frontend
- **Framework:** React 18
- **Router:** React Router DOM v6
- **HTTP Client:** Axios
- **Estilos:** CSS puro con variables (tema claro/oscuro)
- **Arquitectura:** Componentes funcionales + Hooks personalizados

---

## ⚙️ Requisitos Previos

- **Docker** 20.10 o superior
- **Docker Compose** 2.0 o superior
- **Node.js** 18+ (solo para desarrollo sin Docker)
- **npm** 9+ (solo para desarrollo sin Docker)

---

## 🔧 Variables de Entorno

### Backend (.env en raíz)
```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=reto_db
DB_USER=postgres
DB_PASSWORD=postgres123

# Microservices Ports
CREATE_STARTUP_PORT=3011
READ_STARTUP_PORT=3012
UPDATE_STARTUP_PORT=3013
DELETE_STARTUP_PORT=3014
CREATE_TECH_PORT=3021
READ_TECH_PORT=3022
UPDATE_TECH_PORT=3023
DELETE_TECH_PORT=3024

# Gateway
GATEWAY_PORT=3000
```

### Frontend (.env en /frontend)
```env
REACT_APP_API_BASE_URL=http://localhost:3000/v1/api
```

---

## 🚀 Instalación y Ejecución

### Opción 1: Con Docker (Recomendado)

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd reto1

# 2. Crear archivo .env con las variables de entorno
cp .env.example .env

# 3. Levantar todos los servicios
docker-compose up --build

# Esperar a que todos los contenedores estén listos (~2-3 minutos)
```

**URLs disponibles:**
- Frontend: http://localhost:3001
- API Gateway: http://localhost:3000
- Base de datos: localhost:5432

### Opción 2: Sin Docker (Desarrollo)

```bash
# 1. Instalar PostgreSQL localmente y crear la base de datos
createdb reto_db
psql reto_db < db/init.sql

# 2. Backend - Levantar cada microservicio
cd services/startups/create && npm install && npm start &
cd services/startups/read && npm install && npm start &
# ... (repetir para los 8 microservicios)

# 3. Frontend
cd frontend
npm install
npm start
```

---

## 📡 Rutas de API

### Base URL
```
http://localhost:3000/v1/api
```

### Startups Endpoints

#### **CREATE** - Crear nueva startup
```http
POST /v1/api/startups/create
Content-Type: application/json

{
  "name": "TechVision AI",
  "founded_at": "2023-01-15",
  "location": "San Francisco, CA",
  "category": "Artificial Intelligence",
  "funding_amount": 5000000
}

Response 201:
{
  "id": 1,
  "name": "TechVision AI",
  "founded_at": "2023-01-15",
  "location": "San Francisco, CA",
  "category": "Artificial Intelligence",
  "funding_amount": 5000000,
  "created_at": "2025-10-05T10:30:00Z",
  "updated_at": "2025-10-05T10:30:00Z"
}
```

#### **READ** - Listar todas las startups
```http
GET /v1/api/startups/read

Response 200: [array de startups]
```

#### **READ** - Obtener startup por ID
```http
GET /v1/api/startups/read/1

Response 200: {objeto startup}
```

#### **READ** - Filtrar por nombre
```http
GET /v1/api/startups/read?name=Tech

Response 200: [startups filtradas]
```

#### **READ** - Filtrar por categoría
```http
GET /v1/api/startups/read?category=Artificial Intelligence

Response 200: [startups de esa categoría]
```

#### **UPDATE** - Actualizar startup
```http
PUT /v1/api/startups/update/1
Content-Type: application/json

{
  "funding_amount": 7500000,
  "location": "Austin, TX"
}

Response 200: {startup actualizada}
```

#### **DELETE** - Eliminar startup
```http
DELETE /v1/api/startups/delete/1

Response 204: No Content
```

### Technologies Endpoints

#### **CREATE** - Crear nueva tecnología
```http
POST /v1/api/technologies/create
Content-Type: application/json

{
  "name": "Quantum Computing",
  "sector": "Computing",
  "description": "Advanced computing using quantum mechanics principles",
  "adoption_level": "emerging"
}

Response 201: {tecnología creada}
```

#### **READ** - Listar todas las tecnologías
```http
GET /v1/api/technologies/read

Response 200: [array de tecnologías]
```

#### **READ** - Obtener tecnología por ID
```http
GET /v1/api/technologies/read/1

Response 200: {objeto tecnología}
```

#### **READ** - Filtrar por sector
```http
GET /v1/api/technologies/read?sector=Computing

Response 200: [tecnologías del sector]
```

#### **READ** - Filtrar por nivel de adopción
```http
GET /v1/api/technologies/read?adoption_level=emerging

Response 200: [tecnologías emergentes]
```

#### **UPDATE** - Actualizar tecnología
```http
PUT /v1/api/technologies/update/1
Content-Type: application/json

{
  "adoption_level": "growing",
  "description": "Updated description"
}

Response 200: {tecnología actualizada}
```

#### **DELETE** - Eliminar tecnología
```http
DELETE /v1/api/technologies/delete/1

Response 204: No Content
```

### Códigos de Estado HTTP

- `200` - OK (operación exitosa)
- `201` - Created (recurso creado)
- `204` - No Content (eliminación exitosa)
- `400` - Bad Request (datos inválidos)
- `404` - Not Found (recurso no encontrado)
- `500` - Internal Server Error (error del servidor)

---

## 🧪 Pruebas Manuales

### Importar Colección Postman

**Archivo:** `Microservices_CRUD_Collection.postman.json` (incluido en raíz del proyecto)

**Pasos de importación:**
1. Abrir Postman Desktop
2. Click en botón "Import" (esquina superior izquierda)
3. Seleccionar archivo `Microservices_CRUD_Collection.postman.json`
4. Confirmar importación

**Configuración:**
- Variable `baseUrl` preconfigurada: `http://localhost:3000/v1/api`
- 18 requests organizados en 3 carpetas (Startups, Technologies, Health Checks)

### Casos de Prueba Ejecutados

Total de pruebas documentadas: **13 capturas**

#### Startups (9 pruebas)

| # | Endpoint | Método | Validación | Status | Captura |
|---|----------|--------|------------|--------|---------|
| 01 | Colección completa | - | 18 requests importados | ✅ | `01-postman-collection-overview.png` |
| 02 | `/startups/create` | POST | Startup creada correctamente | 201 | `02-startup-create-success.png` |
| 03 | `/startups/create` | POST | Validación campos faltantes | 400 | `03-startup-create-fail.png` |
| 04 | `/startups/read` | GET | Lista completa obtenida | 200 | `04-startup-read-all.png` |
| 05 | `/startups/read?category=...` | GET | Filtros funcionando | 200 | `05-startup-read-filtered.png` |
| 06 | `/startups/read/1` | GET | Detalle individual correcto | 200 | `06-startup-read-by-id.png` |
| 07 | `/startups/update/1` | PUT | Actualización exitosa | 200 | `07-startup-update-success.png` |
| 08 | `/startups/delete/1` | DELETE | Eliminación correcta | 200 | `08-startup-delete-success.png` |
| 09 | `/startups/delete/99999` | DELETE | Error ID inexistente | 404 | `09-startup-delete-404.png` |

#### Technologies (4 pruebas)

| # | Endpoint | Método | Validación | Status | Captura |
|---|----------|--------|------------|--------|---------|
| 10 | `/technologies/create` | POST | Tecnología creada | 201 | `10-technology-create-success.png` |
| 11 | `/technologies/read` | GET | Lista completa | 200 | `11-technology-read-all.png` |
| 12 | `/technologies/update/2` | PUT | Actualización exitosa | 200 | `12-technology-update-success.png` |
| 13 | `/technologies/delete/3` | DELETE | Eliminación correcta | 200 | `13-technology-delete-success.png` |

### Evidencia Fotográfica

**Ubicación:** `/capturas/postman/`

Todas las capturas de pantalla muestran:
- Método HTTP utilizado (GET, POST, PUT, DELETE)
- URL completa del endpoint
- Body de request (cuando aplica)
- Status code de respuesta (200, 201, 400, 404)
- JSON de respuesta completo
- Tiempos de respuesta

### Resumen de Ejecución

✅ **100% de pruebas exitosas**
- Operaciones CRUD completas: ✅
- Validaciones de entrada: ✅
- Manejo de errores: ✅
- Filtros y búsquedas: ✅
- Códigos HTTP apropiados: ✅

**Cobertura total:** 18 endpoints disponibles, 13 casos críticos probados y documentados

### Ejecución Local

Para replicar las pruebas:

```bash
# 1. Levantar servicios
docker-compose up

# 2. Abrir Postman e importar colección

# 3. Ejecutar requests en orden sugerido:
#    - CREATE (para generar datos)
#    - READ (verificar existencia)
#    - UPDATE (modificar datos)
#    - DELETE (eliminar)
```

---

## 📱 Responsividad

El frontend está optimizado para 3 resoluciones:

### Smartphone (~375px)
- Formularios en una columna
- Menú hamburguesa
- Cards apiladas verticalmente
- Botones full-width
- Badge de nivel de adopción oculto

### Tablet (~768px)
- Grid de 2 columnas
- Menú dropdown
- Tablas con scroll horizontal
- Botones centrados

### Desktop (≥1280px)
- Grid de 3 columnas
- Navbar fija
- Layout completo
- Todas las características visibles

**Capturas:** Ver carpeta `/capturas` en el repositorio.

---

## 🎨 Características del Frontend

### Arquitectura Modular
- **17 componentes reutilizables** organizados por función
- **3 hooks personalizados** para lógica compartida
- **Reducción de 60% de código** (de 700 a 280 líneas en componentes principales)

### Componentes Comunes
- `Modal` - Modal genérico con tamaños configurables
- `Alert` - Sistema de alertas con auto-cierre
- `Spinner` - Indicadores de carga
- `ConfirmDialog` - Diálogos de confirmación
- `FormInput` / `FormSelect` - Inputs reutilizables con validación

### Hooks Personalizados
- `useTheme` - Gestión de tema claro/oscuro con persistencia
- `useForm` - Manejo de formularios y validación
- `useApiCall` - Wrapper para llamadas API con loading/error states

### Tema Claro/Oscuro
- Toggle funcional en header
- Persistencia en localStorage
- Variables CSS para fácil customización
- Transiciones suaves

### Validaciones
- Validación en cliente antes de enviar
- Mensajes de error claros
- Feedback visual inmediato

---

## ✅ Checklist de Funcionalidades

### Backend
- ✅ 8 microservicios CRUD independientes
- ✅ API Gateway Nginx funcionando
- ✅ PostgreSQL con tablas startups y technologies
- ✅ Docker Compose orquestando todos los servicios
- ✅ Validación de entrada en todos los endpoints
- ✅ Códigos HTTP apropiados (200, 201, 204, 400, 404, 500)
- ✅ Manejo de errores consistente
- ✅ Endpoints /health en cada microservicio
- ✅ CORS configurado

### Frontend
- ✅ CRUD completo para Startups
- ✅ CRUD completo para Technologies
- ✅ Filtros funcionales (nombre, categoría, sector, adoption_level)
- ✅ Formularios con validación
- ✅ Manejo de errores con mensajes claros
- ✅ Indicadores de carga (spinners)
- ✅ Tema claro/oscuro con persistencia
- ✅ 100% responsivo (3 resoluciones)
- ✅ Arquitectura modular con componentes reutilizables
- ✅ Routing con React Router

---

## ⚠️ Limitaciones Conocidas

1. **Autenticación:** No implementada (no requerida en el reto)
2. **Paginación:** Los listados muestran todos los registros
3. **Tests automatizados:** No implementados (pruebas manuales documentadas)
4. **Caché:** No hay caché de datos en frontend
5. **Migraciones automáticas:** Se ejecutan al iniciar contenedor DB
6. **Rate limiting:** No implementado
7. **Logging avanzado:** Logs básicos en consola

---

## 🔮 Siguientes Pasos

### Mejoras Propuestas
- [ ] Implementar tests unitarios (Jest + React Testing Library)
- [ ] Agregar Context API para estado global
- [ ] Implementar React Query para caché y sincronización
- [ ] Paginación en listados largos
- [ ] Lazy loading de componentes
- [ ] Animaciones con Framer Motion
- [ ] Autenticación con JWT
- [ ] Rate limiting en API Gateway
- [ ] Logging estructurado (Winston/Bunyan)
- [ ] Métricas y monitoreo (Prometheus/Grafana)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Webhooks para notificaciones
- [ ] Export/Import de datos (CSV/Excel)

---

## 👤 Autor

**Nombre:** Carlos Elías Linares Ojeda  
**Email:** [Tu Email]  
**Fecha:** 5 de octubre de 2025  
**Versión:** 1.0.0

---

## 📄 Licencia

Este proyecto fue desarrollado como parte de un reto técnico fullstack.

---

## 📞 Soporte

Para preguntas o problemas:
1. Revisar esta documentación
2. Verificar logs de Docker: `docker-compose logs -f`
3. Revisar que todos los servicios estén corriendo: `docker-compose ps`

**Tiempo estimado de setup:** 10-15 minutos