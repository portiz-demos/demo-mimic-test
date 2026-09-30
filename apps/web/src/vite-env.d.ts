/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ROX_API_KEY: string;
  readonly VITE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
