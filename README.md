# Sistema de Microservicios CRUD - Reto Técnico Fullstack

## Descripción

Sistema de gestión de startups y tecnologías emergentes construido con arquitectura de microservicios desacoplados. Cada operación CRUD se implementa como un microservicio independiente, expuestos a través de un API Gateway Nginx, con frontend React responsivo.

**Dominios:** Startups y Tecnologías Emergentes  
**Microservicios:** 8 servicios independientes (4 por dominio)  
**Gateway:** Nginx como reverse proxy  
**Base de datos:** PostgreSQL compartida  
**Frontend:** React con tema claro/oscuro

---

## URLs de Despliegue en Producción

- Frontend: https://sistema-crud-microservicios.vercel.app/
- API Gateway: https://api-gateway-c6ru.onrender.com
- Repositorio: https://github.com/XxCarlosOjeda12/sistema-crud-microservicios
- Base de datos: PostgreSQL en Render (activa)

---

## IMPORTANTE: Activación de Microservicios en Render

Los servicios desplegados en Render Free Tier entran en modo sleep después de 15 minutos de inactividad. Antes de usar la aplicación web o probar con Postman, es necesario activar manualmente los 8 microservicios ejecutando los siguientes comandos curl:

```bash
# Startups Services
curl https://create-startup-service-k9b4.onrender.com/health
curl https://read-startup-service-lnq5.onrender.com/health
curl https://update-startup-service-nx0g.onrender.com/health
curl https://delete-startup-service-hjp3.onrender.com/health

# Technologies Services
curl https://create-technology-service-ktk2.onrender.com/health
curl https://read-technology-service-xy4o.onrender.com/health
curl https://update-technology-service-nkvc.onrender.com/health
curl https://delete-technology-service-2msh.onrender.com/health
```

Después de ejecutar todos los curls, esperar 30-60 segundos para que los servicios estén completamente activos. Luego se puede acceder normalmente a la aplicación.

**Nota:** Si después de 15 minutos sin actividad se presentan errores 502 Bad Gateway o timeouts, repetir este procedimiento.

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│              https://sistema-crud-microservicios                 │
│                       .vercel.app                                │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ HTTP Requests
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Nginx)                           │
│          https://api-gateway-c6ru.onrender.com                   │
│                    /v1/api/startups/*                            │
│                    /v1/api/technologies/*                        │
└──────┬──────────────┬─────────────┬──────────────┬──────────────┘
       │              │             │              │
       │              │             │              │
   ┌───▼───┐      ┌───▼───┐    ┌───▼───┐      ┌───▼───┐
   │Create │      │ Read  │    │Update │      │Delete │
   │ k9b4  │      │ lnq5  │    │ nx0g  │      │ hjp3  │
   └───┬───┘      └───┬───┘    └───┬───┘      └───┬───┘
       │              │             │              │
       └──────────────┴─────────────┴──────────────┘
                      │
              ┌───────▼────────┐
              │   PostgreSQL   │
              │     Render     │
              │                │
              │  - startups    │
              │  - technologies│
              └────────────────┘

STARTUPS MICROSERVICES (Render):
- CreateStartupService  (k9b4)
- ReadStartupService    (lnq5)
- UpdateStartupService  (nx0g)
- DeleteStartupService  (hjp3)

TECHNOLOGIES MICROSERVICES (Render):
- CreateTechnologyService  (ktk2)
- ReadTechnologyService    (xy4o)
- UpdateTechnologyService  (nkvc)
- DeleteTechnologyService  (2msh)
```

---

## Estructura del Proyecto

```
reto1/
├── gateway/
│   ├── nginx.conf              # Configuración para ejecución local
│   ├── nginx.render.conf       # Configuración para despliegue en Render
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
│   ├── postman/                 (13 pruebas manuales documentadas)
│   └── responsive/              (Screenshots en 3 resoluciones)
├── docker-compose.yml
├── Microservices_CRUD_Collection.postman.json
├── .env.example
└── README.md
```

---

## Stack Tecnológico

### Backend
- Runtime: Node.js 18
- Framework: Express.js
- Base de datos: PostgreSQL 15
- Cliente DB: pg (node-postgres)
- Gateway: Nginx
- Contenedores: Docker + Docker Compose
- Despliegue: Render Free Tier

### Frontend
- Framework: React 18
- Router: React Router DOM v6
- HTTP Client: Axios
- Estilos: CSS con variables (tema claro/oscuro)
- Arquitectura: Componentes funcionales + Hooks personalizados
- Despliegue: Vercel

---

## Requisitos para Ejecución Local

### Software Necesario

**Sistema Operativo:**
- Windows 10/11 con WSL2 (Windows Subsystem for Linux)
- Docker Desktop for Windows

**Componentes:**
1. Docker Desktop (versión 20.10 o superior)
   - Descargar desde: https://www.docker.com/products/docker-desktop
   - Configurar integración con WSL2
2. WSL2 con distribución Ubuntu
   - Habilitar desde PowerShell (Administrador):
     ```powershell
     wsl --install
     ```
3. Docker Compose (incluido con Docker Desktop)

**Verificación de instalación:**
```bash
# Abrir terminal WSL (Ubuntu)
docker --version
docker-compose --version
```

### Configuración Específica para Local

**IMPORTANTE:** Para ejecutar el sistema localmente, realizar los siguientes cambios:

#### 1. Modificar gateway/Dockerfile

Cambiar el puerto expuesto de 10000 a 80:

```dockerfile
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/nginx.conf  # Usar nginx.conf (no nginx.render.conf)

EXPOSE 80  # Cambiar de 10000 a 80 para ejecución local

CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Archivos de configuración Nginx

- **nginx.conf:** Configuración para desarrollo local (puertos internos de Docker)
- **nginx.render.conf:** Configuración para producción en Render (URLs completas HTTPS)

Para local, asegurarse que el Dockerfile copie `nginx.conf` en lugar de `nginx.render.conf`.

---

## Variables de Entorno

### Archivo .env (raíz del proyecto)

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

### Archivo frontend/.env

```env
# Para desarrollo local
REACT_APP_API_BASE_URL=http://localhost:3000/v1/api

# Para producción (Vercel)
REACT_APP_API_BASE_URL=https://api-gateway-c6ru.onrender.com/v1/api
```

---

## Instalación y Ejecución Local

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/XxCarlosOjeda12/sistema-crud-microservicios
cd sistema-crud-microservicios
```

### Paso 2: Configurar variables de entorno

```bash
cp .env.example .env
```

Verificar que el archivo `.env` contenga las variables mostradas anteriormente.

### Paso 3: Modificar configuración del Gateway (solo para local)

Editar `gateway/Dockerfile` para usar puerto 80 y nginx.conf local según se especifica en la sección anterior.

### Paso 4: Levantar servicios con Docker Compose

```bash
# Desde WSL, en la raíz del proyecto
docker-compose up --build
```

Este comando:
- Construye las imágenes de los 8 microservicios
- Construye la imagen del gateway
- Construye la imagen del frontend
- Crea la base de datos PostgreSQL
- Ejecuta el script init.sql para crear las tablas
- Levanta todos los contenedores en la red de Docker

Tiempo estimado: 3-5 minutos en el primer build.

### Paso 5: Verificar que todos los servicios estén corriendo

```bash
docker-compose ps
```

Debe mostrar 11 contenedores activos:
- 8 microservicios (startups y technologies)
- 1 gateway
- 1 frontend
- 1 postgres

### Paso 6: Acceder a la aplicación

- Frontend: http://localhost:3001
- API Gateway: http://localhost:3000
- Base de datos: localhost:5432

---

## Arquitectura Local vs Producción

### Diferencias Clave

| Aspecto | Local | Producción (Render) |
|---------|-------|---------------------|
| Configuración Nginx | nginx.conf | nginx.render.conf |
| Puerto Gateway | 80 | 10000 |
| URLs Microservicios | Nombres Docker (create-startup:3011) | URLs HTTPS completas |
| Base de datos | PostgreSQL local en Docker | PostgreSQL en Render |
| Red | Docker Compose network | Internet público |
| Cold Start | No aplica | Requiere activación manual |

### nginx.conf vs nginx.render.conf

**nginx.conf (local):**
- Usa nombres de servicio de Docker Compose
- Resuelve internamente en la red de Docker
- Ejemplo: `http://create-startup:3011`

**nginx.render.conf (producción):**
- Usa URLs HTTPS completas
- Incluye proxy_ssl_server_name on para SNI
- Timeouts de 90 segundos para cold starts
- Ejemplo: `https://create-startup-service-k9b4.onrender.com`

---

## Rutas de API

### Base URL

**Producción:** `https://api-gateway-c6ru.onrender.com/v1/api`  
**Local:** `http://localhost:3000/v1/api`

### Endpoints de Startups

#### CREATE - Crear startup
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
  "created_at": "2025-10-06T10:30:00Z",
  "updated_at": "2025-10-06T10:30:00Z"
}
```

#### READ - Listar startups
```http
GET /v1/api/startups/read

Response 200: [array de startups]
```

#### READ - Obtener por ID
```http
GET /v1/api/startups/read/1

Response 200: {objeto startup}
```

#### READ - Filtrar por nombre
```http
GET /v1/api/startups/read?name=Tech

Response 200: [startups filtradas]
```

#### READ - Filtrar por categoría
```http
GET /v1/api/startups/read?category=Artificial Intelligence

Response 200: [startups de la categoría]
```

#### UPDATE - Actualizar startup
```http
PUT /v1/api/startups/update/1
Content-Type: application/json

{
  "funding_amount": 7500000,
  "location": "Austin, TX"
}

Response 200: {startup actualizada}
```

#### DELETE - Eliminar startup
```http
DELETE /v1/api/startups/delete/1

Response 204: No Content
```

### Endpoints de Technologies

#### CREATE - Crear tecnología
```http
POST /v1/api/technologies/create
Content-Type: application/json

{
  "name": "Quantum Computing",
  "sector": "Computing",
  "description": "Advanced computing using quantum mechanics",
  "adoption_level": "emerging"
}

Response 201: {tecnología creada}
```

#### READ - Listar tecnologías
```http
GET /v1/api/technologies/read

Response 200: [array de tecnologías]
```

#### READ - Obtener por ID
```http
GET /v1/api/technologies/read/1

Response 200: {objeto tecnología}
```

#### READ - Filtrar por sector
```http
GET /v1/api/technologies/read?sector=Computing

Response 200: [tecnologías del sector]
```

#### READ - Filtrar por nivel de adopción
```http
GET /v1/api/technologies/read?adoption_level=emerging

Response 200: [tecnologías emergentes]
```

#### UPDATE - Actualizar tecnología
```http
PUT /v1/api/technologies/update/1
Content-Type: application/json

{
  "adoption_level": "growing",
  "description": "Updated description"
}

Response 200: {tecnología actualizada}
```

#### DELETE - Eliminar tecnología
```http
DELETE /v1/api/technologies/delete/1

Response 204: No Content
```

### Códigos de Estado HTTP

- 200: OK (operación exitosa)
- 201: Created (recurso creado)
- 204: No Content (eliminación exitosa)
- 400: Bad Request (datos inválidos)
- 404: Not Found (recurso no encontrado)
- 500: Internal Server Error (error del servidor)

---

## Pruebas Manuales

### Colección Postman

El archivo `Microservices_CRUD_Collection.postman.json` incluye 18 requests pre-configurados.

**Importación:**
1. Abrir Postman
2. File → Import
3. Seleccionar `Microservices_CRUD_Collection.postman.json`

**Configuración de variables:**
- Para local: `baseUrl = http://localhost:3000/v1/api`
- Para producción: `baseUrl = https://api-gateway-c6ru.onrender.com/v1/api`

**Nota para producción:** Ejecutar los 8 comandos curl de activación antes de probar con Postman.

### Casos de Prueba Documentados

Se incluyen 13 capturas de pantalla en `/capturas/postman/` que demuestran:

#### Startups (9 pruebas)

| Número | Endpoint | Método | Validación | Status | Archivo |
|--------|----------|--------|------------|--------|---------|
| 01 | Colección | - | 18 requests importados | OK | 01-postman-collection-overview.png |
| 02 | /startups/create | POST | Creación exitosa | 201 | 02-startup-create-success.png |
| 03 | /startups/create | POST | Validación de campos | 400 | 03-startup-create-fail.png |
| 04 | /startups/read | GET | Lista completa | 200 | 04-startup-read-all.png |
| 05 | /startups/read?category=... | GET | Filtros | 200 | 05-startup-read-filtered.png |
| 06 | /startups/read/1 | GET | Por ID | 200 | 06-startup-read-by-id.png |
| 07 | /startups/update/1 | PUT | Actualización | 200 | 07-startup-update-success.png |
| 08 | /startups/delete/1 | DELETE | Eliminación | 200 | 08-startup-delete-success.png |
| 09 | /startups/delete/99999 | DELETE | ID inexistente | 404 | 09-startup-delete-404.png |

#### Technologies (4 pruebas)

| Número | Endpoint | Método | Validación | Status | Archivo |
|--------|----------|--------|------------|--------|---------|
| 10 | /technologies/create | POST | Creación exitosa | 201 | 10-technology-create-success.png |
| 11 | /technologies/read | GET | Lista completa | 200 | 11-technology-read-all.png |
| 12 | /technologies/update/2 | PUT | Actualización | 200 | 12-technology-update-success.png |
| 13 | /technologies/delete/3 | DELETE | Eliminación | 200 | 13-technology-delete-success.png |

Cada captura muestra:
- Método HTTP y URL completa
- Request body (cuando aplica)
- Status code de respuesta
- JSON de respuesta completo
- Tiempo de respuesta

---

## Responsividad del Frontend

El sistema fue desarrollado con enfoque mobile-first y probado en 3 resoluciones.

### Screenshots en /capturas/responsive/

#### Smartphone (375px)
- Formularios de una columna
- Menú hamburguesa
- Cards verticales
- Botones full-width
- Scroll horizontal en tablas

#### Tablet (768px)
- Grid de 2 columnas
- Menú dropdown
- Mayor espaciado
- Formularios de 2 columnas

#### Desktop (1280px+)
- Grid de 3 columnas
- Navbar fija
- Layout completo
- Todas las funcionalidades visibles

Las capturas incluyen vistas de:
- Listado de startups
- Listado de tecnologías
- Formularios de creación/edición
- Tema claro y oscuro en cada resolución

**Tecnologías utilizadas:**
- CSS Media Queries
- Flexbox y CSS Grid
- Variables CSS para temas

---

## Características Principales

### Backend

- 8 microservicios independientes con responsabilidad única
- API Gateway Nginx con versionado de rutas (/v1/api)
- PostgreSQL con tablas normalizadas
- Validación de entrada en todos los endpoints
- Manejo consistente de errores con códigos HTTP apropiados
- Endpoints /health para monitoreo
- CORS configurado para el frontend
- Docker Compose para orquestación local

### Frontend

- CRUD completo para ambos dominios
- Filtros dinámicos (nombre, categoría, sector, nivel de adopción)
- Validación en cliente antes de envío
- Mensajes de error descriptivos
- Indicadores de carga durante peticiones
- Tema claro/oscuro con persistencia
- Responsive design en 3 resoluciones
- Componentes reutilizables y hooks personalizados
- Routing con React Router

---

## Limitaciones Conocidas

### Render Free Tier

1. **Cold Start:** Servicios requieren activación manual después de 15 minutos de inactividad
2. **Timeouts:** Primera petición sin activación previa probablemente fallará con 502
3. **Latencia:** Cold start tarda 40-60 segundos por servicio
4. **Disponibilidad:** No apto para producción con alta disponibilidad

### Funcionalidades No Implementadas

1. **Autenticación:** No hay sistema de usuarios ni control de acceso
2. **Paginación:** Listados muestran todos los registros
3. **Tests Automatizados:** Solo pruebas manuales documentadas
4. **Caché:** No hay caché en frontend ni backend
5. **Rate Limiting:** No hay límite de peticiones por IP
6. **Logging Avanzado:** Solo logs básicos en consola
7. **Migraciones Automáticas:** Schema definido en init.sql estático

---

## Troubleshooting

### Error 502 Bad Gateway en producción

**Causa:** Microservicios dormidos en Render.

**Solución:** Ejecutar los 8 comandos curl de activación y esperar 60 segundos.

### Servicios no responden localmente

```bash
# Verificar que todos los contenedores estén corriendo
docker-compose ps

# Ver logs de un servicio específico
docker-compose logs create-startup

# Ver logs en tiempo real
docker-compose logs -f
```

### Error de conexión a base de datos

```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Ver logs de PostgreSQL
docker-compose logs postgres

# Recrear contenedor de base de datos
docker-compose down
docker-compose up -d postgres
```

### Frontend no se conecta al backend

Verificar variable de entorno en `frontend/.env`:
```env
REACT_APP_API_BASE_URL=http://localhost:3000/v1/api
```

Rebuild del frontend:
```bash
docker-compose down
docker-compose up --build frontend
```

---

## Despliegue en Producción

### Arquitectura de Despliegue

- Frontend: Vercel (despliegue automático desde GitHub)
- API Gateway: Render Web Service
- Microservicios: 8 Render Web Services independientes
- Base de datos: Render PostgreSQL

### Configuración Específica de Render

#### Gateway Dockerfile para producción:

```dockerfile
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf

COPY nginx.render.conf /etc/nginx/nginx.conf

EXPOSE 10000

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.render.conf características:

- URLs HTTPS completas de microservicios
- proxy_ssl_server_name on para SNI correcto
- Timeouts de 90 segundos
- Sin upstreams (proxy_pass directo)

### Variables de Entorno en Render

Cada microservicio necesita:
```
DB_HOST=<internal-database-url>
DB_PORT=5432
DB_NAME=reto_db
DB_USER=postgres
DB_PASSWORD=<database-password>
PORT=<assigned-by-render>
```

---

## Checklist de Funcionalidades

### Requisitos del Reto

- [x] 8 microservicios CRUD independientes
- [x] API Gateway genérico (Nginx)
- [x] Comunicación HTTP directa
- [x] Frontend funcional y responsivo (3 resoluciones)
- [x] Base de datos PostgreSQL compartida
- [x] Docker + Docker Compose
- [x] Despliegue funcional en la nube
- [x] Documentación completa
- [x] Pruebas manuales documentadas con capturas

### Extras Implementados

- [x] Endpoints /health en todos los microservicios
- [x] Versionado de API (/v1/api)
- [x] Tema claro/oscuro en frontend
- [x] Validaciones en cliente y servidor
- [x] Manejo robusto de errores
- [x] Arquitectura modular con hooks personalizados
- [x] CORS configurado correctamente

---

## Autor

**Nombre:** Carlos Elias Linares Ojeda  
**Fecha de entrega:** 6 de octubre de 2025  
**Repositorio:** https://github.com/XxCarlosOjeda12/sistema-crud-microservicios  
**Versión:** 4.0.0

---

## Notas Finales

Este proyecto cumple con todos los requisitos especificados en el reto técnico:

- Arquitectura de microservicios desacoplados por acción CRUD
- API Gateway genérico con Nginx
- Frontend responsivo en 3 resoluciones
- Sistema completamente contenerizado
- Despliegue funcional en producción
- Documentación completa con ejemplos
- Pruebas manuales documentadas con evidencia fotográfica

Tiempo estimado de setup:
- Sistema desplegado: 2-3 minutos (con activación de microservicios)
- Sistema local: 10-15 minutos