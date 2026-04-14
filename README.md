# ⚡ Energy Supplier Dashboard + CRM

## Arquitectura del proyecto

```
energy-dashboard/
├── index.html                  ← Punto de entrada HTML
├── package.json                ← Dependencias y scripts
├── vite.config.js              ← Configuración de Vite (bundler)
│
├── public/                     ← Archivos estáticos (favicon, imágenes)
│
└── src/
    ├── main.jsx                ← Punto de entrada React
    ├── App.jsx                 ← Componente principal (orquestador)
    ├── index.css               ← Estilos globales + CSS variables
    │
    ├── store/
    │   └── index.js            ← Estado global (Zustand)
    │                             Reemplaza TODAS las variables globales
    │                             del código original (currentUser, sel, db, etc.)
    │
    ├── services/
    │   └── api.js              ← Comunicación con tu backend
    │                             Google Apps Script / Cloudflare Workers
    │                             Centraliza TODOS los fetch()
    │
    ├── data/
    │   └── mockData.js         ← Datos de demostración
    │                             Eliminar cuando conectes el backend real
    │
    ├── components/
    │   ├── ui/
    │   │   └── index.jsx       ← Componentes reutilizables
    │   │                         Toast, StatusBadge, Card, MetricCard
    │   │
    │   ├── layout/
    │   │   └── Header.jsx      ← Barra superior naranja
    │   │
    │   ├── steps/              ← Cada paso del flujo de ventas
    │   │   ├── StepDNC.jsx         Paso 0: Validador DNC
    │   │   ├── StepState.jsx       Paso 1: Selección de estado
    │   │   ├── StepUtility.jsx     Paso 2: Selección de utilidad
    │   │   ├── StepSupplier.jsx    Paso 3: Supplier & Rates
    │   │   ├── StepChecklist.jsx   Paso 4: Checklist + Template
    │   │   └── StepNav.jsx         Barra de navegación de pasos
    │   │
    │   └── crm/                ← Módulo CRM
    │       ├── Overview.jsx        Métricas y gráficos generales
    │       ├── Pipeline.jsx        Vista Kanban de ventas
    │       ├── TeamView.jsx        Rendimiento de agentes (admin)
    │       ├── Schedule.jsx        Tareas programadas
    │       └── Database.jsx        Tabla completa de registros
    │
    └── pages/
        ├── LoginScreen.jsx     ← Pantalla de login
        ├── SalesFlow.jsx       ← Orquestador del flujo de 5 pasos
        └── CRMDashboard.jsx    ← Orquestador del CRM
```

---

## ¿Qué tecnología usa y por qué?

| Tecnología | Para qué sirve | Por qué |
|---|---|---|
| **React 18** | Construir la interfaz | Componentes reutilizables, rendimiento, ecosistema |
| **Vite** | Bundler / servidor dev | 10x más rápido que Webpack, recarga instantánea |
| **Zustand** | Estado global | Reemplaza las ~50 variables globales del original |
| **Recharts** | Gráficos del CRM | Gráficos de barras, líneas, pie charts |
| **Lucide React** | Iconos | Iconos limpios y consistentes |
| **date-fns** | Manejo de fechas | Formateo de fechas robusto |
| **React Router** | Navegación | Para futuras rutas (/sales, /crm, /admin) |

---

## Paso a paso para instalar y ejecutar

### Prerrequisitos

1. **Node.js** (versión 18 o superior)
   - Ve a https://nodejs.org
   - Descarga la versión LTS
   - Instálalo (siguiente, siguiente, finalizar)
   - Verifica: abre terminal y escribe `node --version`

### Instalación

2. **Abre una terminal** (Command Prompt, PowerShell, o Terminal en Mac)

3. **Navega a la carpeta del proyecto:**
   ```bash
   cd ruta/a/energy-dashboard
   ```

4. **Instala las dependencias:**
   ```bash
   npm install
   ```
   Esto descarga React, Vite, Recharts, etc. automáticamente.
   Toma 1-2 minutos. Verás una carpeta `node_modules/` aparecer.

### Desarrollo

5. **Arranca el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Se abrirá automáticamente en http://localhost:3000
   
   Cada vez que guardes un archivo, la página se actualiza sola.

### Producción

6. **Cuando quieras publicar la app:**
   ```bash
   npm run build
   ```
   Esto genera una carpeta `dist/` con archivos optimizados.
   Sube el contenido de `dist/` a tu hosting.

---

## ¿Cómo conecto mi backend de Google Sheets?

Abre `src/services/api.js` y:

1. Cambia `SESSIONS_URL` por tu URL real de Apps Script
2. Cambia `APP_SECRET` por tu secreto real
3. En `src/App.jsx`, reemplaza la carga de mock data por llamadas a la API:

```jsx
// ANTES (mock data):
import { STATES } from './data/mockData';
useDataStore.setState({ states: STATES });

// DESPUÉS (API real):
import { getStates } from './services/api';
const result = await getStates();
useDataStore.setState({ states: result.states });
```

---

## ¿Cómo agrego una nueva funcionalidad?

1. Crea un archivo en la carpeta correcta (ej: `src/components/crm/NewFeature.jsx`)
2. Importa lo que necesites del store: `import { useAuthStore } from '../../store'`
3. Importa tu componente donde lo necesites
4. Listo — Vite recarga automáticamente

---

## Comparación: Antes vs Después

| Aspecto | Código original | Proyecto React |
|---|---|---|
| Archivo | 1 archivo de 7,600 líneas | ~20 archivos de 50-200 líneas |
| Variables | ~50 globales sueltas | Store centralizado (Zustand) |
| API calls | fetch() dispersos en 15+ lugares | 1 archivo centralizado (api.js) |
| CSS | 2,000 líneas mezcladas | CSS variables + archivos separados |
| Desarrollo | Editar → refrescar manualmente | Editar → recarga automática |
| Errores | Difícil encontrarlos | Editor los marca en tiempo real |
| Gráficos | Barras hechas con divs | Recharts (profesional) |
| Performance | Babel compila en el navegador | Pre-compilado y optimizado |
