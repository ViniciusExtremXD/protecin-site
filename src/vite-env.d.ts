/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE?: string;
  readonly VITE_GTM_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Ano do build (vite.config.ts → define). */
declare const __ANO_BUILD__: number;

interface Window {
  dataLayer?: Record<string, unknown>[];
}
