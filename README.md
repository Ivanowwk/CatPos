# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Aplicación de Escritorio (Tauri + Windows Installer)

CatPos está configurado como aplicación de escritorio nativa usando **Tauri**, que empaqueta tu app React en un ejecutable independiente con WebView2 de Windows.

### Requisitos previos (una sola vez):

1. **Rust toolchain:** Descarga desde [https://rustup.rs/](https://rustup.rs/) e instala
2. **Visual Studio Build Tools for C++:** Necesario para compilar Rust en Windows
   - Descarga desde [https://visualstudio.microsoft.com/downloads/](https://visualstudio.microsoft.com/downloads/)
   - Durante instalación, selecciona: "C++ build tools" y "Windows 10 SDK"
3. **WebView2 Runtime:** (Opcional, ya incluido en Windows 11+) [Descargar](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

### Desarrollo en vivo (con hot-reload):

```bash
npm run dev
```

Abre la ventana nativa de Tauri. Los cambios en código TypeScript/React se reflejan automáticamente.

### Compilar para distribución (Windows installer .msi):

```bash
npm run tauri:build
```

Esto genera un instalador en `src-tauri/target/release/bundle/msi/`.

### Versión web (sin Tauri, solo en navegador):

```bash
npm run web:dev    # Desarrollo Vite normal
npm run web:build  # Build estático en carpeta 'dist/'
```

### Personalizar aplicación:

- **Nombre/ícono/versión:** Edita `src-tauri/tauri.conf.json`
- **Comportamiento del ejecutable:** Edita `src-tauri/src/main.rs` (código Rust)
- **Ícono de la ventana:** Reemplaza archivos en `src-tauri/icons/`
