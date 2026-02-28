# Sistema de Gestión de Graduación - Prototipo Frontend 🎓

Este repositorio contiene el prototipo funcional del frontend para el Sistema de Gestión del Proceso de Graduación. El objetivo de esta interfaz es digitalizar, automatizar y brindar seguimiento en tiempo real a los trámites de graduación, eliminando la necesidad de procesos presenciales.

🔗 **Demo en vivo:** [v0-graduation-process-optimization.vercel.app](https://v0-graduation-process-optimization.vercel.app/)

## Stack Tecnológico
Para agilizar el desarrollo y garantizar una interfaz de usuario moderna, responsiva y accesible, este prototipo fue construido con:
* **Framework:** React / Next.js
* **Estilos:** Tailwind CSS
* **Componentes UI:** Shadcn UI
* **Gráficos y Estadísticas:** Recharts
* **Iconografía:** Lucide React

---

## Historias de Usuario Implementadas

El prototipo cubre a cabalidad los siguientes requerimientos (Issues) asignados:

### Módulo del Estudiante
* **HU-01 - Registro de Solicitud de Graduación:** Formulario interactivo validado en cliente. Exige todos los campos obligatorios (incluyendo Modalidad de Graduación) y bloquea el envío si existe una solicitud activa, generando un número de seguimiento único.
* **HU-03 - Carga y Gestión de Documentos:** Componente de subida de archivos restringido exclusivamente a formatos `.pdf`. Incluye validación de peso máximo para los requisitos (Cierre de pensum, Solvencia, DPI, Constancias y Trabajo final).
* **HU-05 - Seguimiento del Estado:** Línea de tiempo (Stepper) interactiva con 6 etapas (Iniciado, Revisión Académica, Revisión Financiera, Observado, Aprobado/Rechazado, Acta Generada). Muestra el tiempo transcurrido en cada etapa y notificaciones en tiempo real.

### Módulo de Revisión (Administrador / Director)
* **HU-04 - Panel de Revisión Administrativa:** Bandeja de entrada con tabla de datos y filtros avanzados (Carrera, Estado, Fecha). Incluye un modal detallado del expediente digital con visor de documentos y botones de acción (Aprobar, Observar, Rechazar). El campo de observación es estrictamente obligatorio para rechazos o correcciones.
* **HU-09 y HU-10 - Dashboard Estadístico y Exportación:** Panel de control para la dirección con tarjetas de KPIs (Solicitudes activas, Tiempo promedio, Tasa de rechazo). Incluye gráficos de barras y de pastel interactivos, filtros por carrera/semestre y botones funcionales para exportar los reportes en PDF y Excel.

### Seguridad y Utilidades
* **HU-07 - Gestión de Roles y Permisos (RBAC):** Módulo de inicio de sesión que simula la validación de credenciales y redirige a vistas protegidas según el rol del usuario (Estudiante, Administrador, Director). Las rutas y el menú de navegación se adaptan dinámicamente.
* **HU-11 - Validación Pública con QR:** Vista pública, independiente del sistema de login, que simula el escaneo de un código QR impreso en el acta, mostrando su estado de validez y los datos básicos del graduado.