import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'astro:i18n': fileURLToPath(new URL('./src/test/mocks/astro-i18n.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    globals: true,
  },
});
