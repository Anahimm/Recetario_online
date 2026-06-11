# 📖 Las Recetas de Anahí - Proyecto Fullstack

Se trata de una plataforma de gestión de recetas culinarias donde los usuarios pueden registrarse, administrar sus propias recetas y compartir enlaces públicos de sus creaciones, incorporando un sistema de calificación interactivo inspirado en la gastronomía argentina.

🔗 Link al Proyecto en Vivo: [las recetas de Anahí](https://lasrecetasdeanahi.netlify.app/)

> **👤 Credenciales de Prueba:**
> Podés crear un usuario nuevo o usar este de prueba: 
> * **Mail:** admin@test.com 
> * **Pass:** admin123

## 🚀 Tecnologías Utilizadas

### Frontend
* **React 18** con **TypeScript** (Vite como empaquetador)
* **CSS Modules**
* **React Router DOM v6** para la navegación y el ruteo
* **Context API** para la gestión del estado global de autenticación

### Backend
* **Node.js** con **TypeScript**
* **Express** como framework principal para la creación de la API REST
* **Prisma ORM** para el modelado de datos, migraciones y consultas Type-safe
* **PostgreSQL** como motor de base de datos relacional (gestionado mediante **DBeaver**)
* **JWT (JSON Web Tokens)** para la gestión segura de sesiones y protección de rutas

### Despliegue en la Nube (Deployment)
* **Frontend:** Alojado en **Netlify** con despliegue automático
* **Backend:** Desplegado como Web Service en **Render**
* **Base de Datos:** Alojada en **Neon** (Serverless PostgreSQL)

---

## 🗄️ Estructura y Base de Datos

La persistencia de datos se modeló en **PostgreSQL**, aprovechando las capacidades de **Prisma** para generar un esquema fuertemente tipado. El diseño incluye:
* **Usuarios:** Gestión de credenciales cifradas y perfiles.
* **Recetas:** Almacenamiento de instrucciones, ingredientes y metadatos de los platos.
* **Calificaciones:** Sistema relacional para el feedback de recetas públicas.

**Estructura del Backend:**
* `/src/routes`: Definición de los endpoints de la API
* `/src/controllers`: Lógica de negocio y manejo de peticiones
* `/src/middlewares`: Validación de tokens JWT y control de acceso
* `/prisma`: Esquema de la base de datos (`schema.prisma`) y migraciones

---

## 🎨 Decisiones de Diseño y UI/UX

* **Tipografía:** Se implementó **Montserrat** (Variable Font)
* **Paleta de Colores:** Se utilizó hacia una gama de **Naranjas y Duraznos (#F08D39, #F3BE7A)**
* **Sistema de Calificación:** En lugar de estrellas convencionales, se desarrolló un **Calificador de Jurados** con las figuras más icónicas de la cocina argentina (Paulina, Donato, Maru, Betular y Martitegui)

---

## 🛠️ Instalación y Configuración (Entorno Local)

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/Anahimm/Recetario_online.git](https://github.com/Anahimm/Recetario_online.git)
   ```

2. **Configurar el Backend:**
   * Abrir una terminal en la carpeta `/backend`.
   * Ejecutar `npm install`.
   * Crear un archivo `.env` en la raíz de `/backend` con tu cadena de conexión a PostgreSQL: `DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"` y tu `JWT_SECRET`.
   * Ejecutar las migraciones y generar el cliente: 
     ```bash
     npx prisma migrate dev
     npx prisma generate
     ```
   * Levantar el servidor: `npm run dev` (o el script de desarrollo que utilices).

3. **Configurar el Frontend:**
   * Abrir una terminal en la carpeta `/frontend`.
   * Ejecutar `npm install`.
   * Levantar la aplicación: `npm run dev`.

---

## 👨‍💻 Sobre la Autora

**Anahí**
* Analista Programadora Universitaria.
* Estudiante avanzada de la Licenciatura en Sistemas en la Universidad Nacional de Lanús (UNLa).

---

### 📝 Nota de Desarrollo
Este proyecto contó con el apoyo de herramientas de IA (Gemini) como asistencia técnica para el refinamiento de componentes UI, refactorización de CSS Modules y optimización de tipados.