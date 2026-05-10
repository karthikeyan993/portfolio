import js from '@eslint/js';
import astroPlugin from 'eslint-plugin-astro';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  { ignores: ['dist', 'node_modules', '.astro', 'design'] },
  {
    languageOptions: {
      globals: {
        URL: 'readonly',
        console: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        navigator: 'readonly',
        process: 'readonly',
        Response: 'readonly',
        window: 'readonly',
      },
    },
  },
  js.configs.recommended,
  ...astroPlugin.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },
];
