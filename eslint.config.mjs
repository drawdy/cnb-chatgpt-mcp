import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/**
 * https://typescript-eslint.io/packages/typescript-eslint/#usage-with-other-plugins
 */
export default defineConfig(
  {
    // config with just ignores is the replacement for `.eslintignore`
    ignores: [
      'dist/**',
      'node_modules/**',
      '**/*.d.ts',
      'src/helpers/request/**',
      'src/api/interfaces/**',
      'src/api/build/**',
      'src/api/knowledge-base/**'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettierPlugin
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: dirname(fileURLToPath(import.meta.url))
      },
      sourceType: 'module'
    },
    rules: {
      // Disable conflicting rules from prettier config
      ...prettierConfig.rules,

      // Enable prettier as ESLint rule
      'prettier/prettier': 'error',

      // Your TypeScript rules
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/member-ordering': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn'
    }
  },
  {
    // disable type-aware linting on JS files
    files: ['**/*.js', '**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked]
  }
);
