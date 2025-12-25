/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Removed Message Central and Exotel API environment variables
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}