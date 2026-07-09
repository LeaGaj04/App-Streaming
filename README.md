# 🎥 App Streaming - Liga Amateur Broadcast Suite

![Estado del Proyecto](https://img.shields.io/badge/Estado-En_Desarrollo-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![WebRTC](https://img.shields.io/badge/WebRTC-Supported-orange)
![IA](https://img.shields.io/badge/Desarrollado_con-Antigravity_AI-black)

**App Streaming** es una plataforma web profesional para la gestión de transmisiones en vivo (switcher estilo Control Room), diseñada específicamente para eventos de ligas amateurs. Permite controlar múltiples cámaras, gestionar escenas y coordinar toda la operación de transmisión desde una única interfaz intuitiva directamente en el navegador.

---

## 🌟 Características Principales

- **Switcher en Vivo:** Interfaz estilo "Control Room" con pantalla principal (Program) y casillas de previsualización (Preview).
- **Soporte de Cámaras Reales (WebRTC):** Detección automática y uso de las cámaras conectadas al dispositivo (cámaras web, frontales y traseras de teléfonos móviles).
- **Gestión de Eventos:** Cronología y temporizador en tiempo real para hacer seguimiento exacto de la transmisión (ideal para partidos de fútbol, cortes comerciales, etc.).
- **Diseño Premium y Oscuro:** Interfaz limpia, minimalista y libre de distracciones optimizada para operadores de transmisión.
- **Enrutamiento y SPA:** Construido como una aplicación de una sola página rápida y reactiva usando React Router.

---

## 🤖 Desarrollo Asistido por Inteligencia Artificial

Este proyecto está siendo codesarrollado utilizando la inteligencia artificial agéntica **Antigravity de Google DeepMind**. La IA ha colaborado en el rediseño de la experiencia de usuario (UX/UI), la integración de la API nativa de WebRTC (`navigator.mediaDevices`), y el despliegue del proyecto asegurando un código moderno, limpio y eficiente.

---

## 🚀 Instalación y Ejecución

Sigue estos pasos para abrir y ejecutar el proyecto en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/LeaGaj04/App-Streaming.git
```

### 2. Navegar a la carpeta del proyecto
El código fuente de la aplicación se encuentra dentro de la subcarpeta `app-streaming`.
```bash
cd App-Streaming/app-streaming
```

### 3. Instalar las dependencias
Asegúrate de tener [Node.js](https://nodejs.org/) instalado.
```bash
npm install
```

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

### 5. Abrir en el navegador
Por defecto, la aplicación estará disponible en:
```
http://localhost:5173
```
*(Nota: Para acceder a las cámaras en dispositivos móviles a través de red local, se requiere acceder mediante una conexión segura `HTTPS` o mediante servicios de túneles web).*

---

## 📁 Estructura del Proyecto

El proyecto está estructurado utilizando React y Vite, separando de forma clara la lógica del enrutador, las vistas principales, componentes visuales, y la configuración para su integración como aplicación de escritorio con Electron.

```text
├── 📁 app-streaming/          # Carpeta principal de la aplicación
│   ├── 📁 electron/           # Código de backend para la versión de escritorio
│   │   ├── main.js            # Proceso principal de Electron (Ventanas y comunicación)
│   │   └── preload.js         # Script de seguridad (IPC)
│   │
│   ├── 📁 public/             # Archivos estáticos y recursos públicos
│   │
│   └── 📁 src/                # Código fuente principal de React
│       ├── 📁 assets/         # Imágenes locales y gráficos
│       │
│       ├── 📁 components/     # Componentes reusables de la interfaz
│       │   ├── CanvasCompositor.jsx # Motor de mezcla de video para la señal en vivo
│       │   └── sidebar.jsx    # Barra de navegación
│       │
│       ├── App.jsx            # Vista principal: Control Room (Switcher)
│       ├── Root.jsx           # Enrutamiento (React Router) y Estado Global (Cámaras)
│       ├── addCam.jsx         # Vista: Asignación dinámica de hardware (Ajustes de cámara)
│       ├── login.jsx          # Vista: Pantalla de inicio de sesión
│       ├── index.css          # Estilos globales y variables de Tailwind CSS
│       └── main.jsx           # Punto de entrada de la aplicación
│
├── vercel.json                # Configuración de despliegue para Vercel
├── vite.config.js             # Configuración del servidor y empaquetador Vite
└── package.json               # Scripts y dependencias del ecosistema
```

## 🚀 Despliegue (Vercel)

El proyecto está preparado para desplegarse fácilmente en **Vercel**:
1. Importa el repositorio.
2. Define `app-streaming` como el **Root Directory**.
3. Selecciona **Vite** como Framework Preset.
4. *(Se incluye `vercel.json` para garantizar el correcto enrutamiento SPA).*

---
*Hecho con ❤️ y el poder de la IA para llevar las transmisiones amateurs al siguiente nivel.*
