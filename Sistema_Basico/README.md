## Instalación de dependencias

Para correr este proyecto, asegúrate de tener **Node.js** y **npm** instalados.  
Luego, ejecuta el siguiente comando dentro del directorio del proyecto:

```bash
# Instalar dependencias principales
npm install --legacy-peer-deps react react-dom typescript vite

# Tailwind CSS y PostCSS
npm install --legacy-peer-deps tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Iconos y UI
npm install --legacy-peer-deps lucide-react @radix-ui/react-accordion @radix-ui/react-dialog @radix-ui/react-slot @radix-ui/react-select clsx

# Notificaciones
npm install --legacy-peer-deps sonner

# ESLint y Prettier (opcional, recomendado)
npm install --legacy-peer-deps eslint prettier eslint-config-prettier eslint-plugin-react

# Tipos para TypeScript
npm install --legacy-peer-deps @types/react @types/react-dom

# Dependencias de desarrollo adicionales (opcional)
npm install --legacy-peer-deps vite-plugin-svgr
