# Sentinel Track Systems – Plataforma IoT + E‑Commerce

## Descripción

Sentinel Track Systems es una plataforma integral que combina **IoT (Internet of Things)** y **E‑Commerce**, diseñada para rastrear en tiempo real **mascotas, vehículos, activos y personas con discapacidad**, mientras ofrece una experiencia de compra moderna y segura.

El proyecto está desarrollado en **Node.js**, con arquitectura modular basada en **MVC + Repositorios**, integrando:

- **IoT**: Dispositivos GPS, ubicaciones y alertas.
- **E‑Commerce**: Carritos, productos, tickets, reseñas y envíos.
- **Autenticación**: Registro, login, roles y recuperación de credenciales.
- **Configuración**: Páginas dinámicas y parámetros del sistema Sentinel Track Systems.
- **Comunicación**: Socket.IO para tiempo real y Nodemailer para notificaciones por correo.
- **Documentación y Calidad**: Swagger para APIs y test unitarios para asegurar confiabilidad.

---

## ⚙️ Tecnologías principales

- **Node.js / Express.js** – Backend modular.
- **MongoDB / Mongoose** – Base de datos NoSQL.
- **Socket.IO** – Comunicación en tiempo real.
- **Nodemailer** – Envío de correos electrónicos.
- **JWT / bcrypt** – Autenticación y seguridad.
- **Swagger** – Documentación interactiva de APIs.
- **Jest / Supertest** – Test unitarios y de integración.

---

## 🛠️ Arquitectura

La aplicación sigue el patrón **MVC extendido con repositorios**:

- **Modelos**: Definen la estructura de datos (usuarios, productos, carritos, tickets, ubicaciones).
- **Repositorios**: Encapsulan el acceso a la base de datos.
- **Controladores**: Orquestan la lógica de negocio.
- **Rutas**: Exponen endpoints REST organizados por módulos.
- **Servicios externos**: Nodemailer, Socket.IO, configuración dinámica.

---

## 🔐 Autenticación

- Registro y login de usuarios.
- Recuperación de contraseñas con **reset token**.
- Contraseñas encriptadas con **bcrypt**.
- Autenticación con **JWT**.
- Roles dinámicos: `user`, `admin`, `superadmin`.

---

## 🌐 IoT

- **GPSDevice**: Registro y administración de dispositivos GPS.
- **Location**: Persistencia de coordenadas en tiempo real.
- **Entities**: Vehículos, activos, mascotas y personas con discapacidad.
- **GeoFence**: Alertas de salida de zonas seguras.
- **Socket.IO**: Transmisión en tiempo real de ubicaciones y estados.

---

## 🛒 E‑Commerce

- **Carrito**: Soporte para invitados y usuarios registrados.
- **Productos**: Catálogo dinámico con categorías, reseñas y estados comerciales.
- **Tickets**: Registro de compras con estados (`pagado`, `cancelado`, `en proceso`).
- **Reseñas**: Opiniones y calificaciones de productos.
- **Envíos**: Configuración de destinos y costos.

---

## 📧 Comunicación

- **Socket.IO**:
  - IoT: Ubicaciones y alertas en tiempo real.
  - E‑Commerce: Actualización de carritos, stock y tickets.

- **Nodemailer**:
  - Autenticación: Registro y recuperación de credenciales.
  - Usuarios: Cambios de rol y eliminación de cuentas.
  - E‑Commerce: Confirmación de compras y estados de tickets.
  - IoT: Alertas de dispositivos GPS y seguridad.

---

## 📖 Documentación

- **Swagger**: Documentación interactiva de APIs en `/api-docs`.
- Organización por módulos: Autenticación, Usuarios, IoT, E‑Commerce, Configuración.
- Soporte para autenticación JWT en pruebas de endpoints.

---

## ✅ Calidad y Testing

- **Test Unitarios** con Jest y Supertest.
- Cobertura en repositorios, controladores y utils.
- Uso de **MongoDB Memory Server** para pruebas en memoria.
- Integración con CI/CD para asegurar despliegues confiables.

---

## 📚 Glosario Técnico

- **MVC**: Patrón de arquitectura que separa datos, lógica y vistas.
- **Repositorio**: Capa que encapsula acceso a la base de datos.
- **JWT**: Token firmado para autenticación segura.
- **bcrypt**: Algoritmo de hashing para contraseñas.
- **Socket.IO**: Comunicación en tiempo real cliente-servidor.
- **Nodemailer**: Librería para envío de correos electrónicos.
- **Swagger**: Documentación interactiva de APIs.
- **Test Unitarios**: Validación de funciones y módulos de manera aislada.

---

## 🏁 Conclusión

Sentinel Track Systems se consolida como una **plataforma integral IoT + E‑Commerce**, diseñada con estándares profesionales de arquitectura, seguridad y calidad.

- En la **capa IoT**, garantiza rastreo en tiempo real de entidades críticas.
- En la **capa e‑commerce**, ofrece una experiencia de compra moderna y confiable.
- En la **capa de autenticación y usuarios**, asegura procesos seguros y roles dinámicos.
- En la **capa de configuración**, brinda flexibilidad y adaptabilidad.
- En la **capa de comunicación**, combina tiempo real con notificaciones por correo.
- En la **capa de documentación y calidad**, asegura transparencia y confiabilidad con Swagger y test unitarios.

Sentinel Track Systems es un **ecosistema modular, escalable y seguro**, preparado para evolucionar hacia un entorno de alto impacto donde convergen **IoT, comercio electrónico y seguridad digital**.

---
