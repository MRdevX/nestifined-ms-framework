import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';
import typescriptEslintParser from '@typescript-eslint/parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import stylisticJsPlugin from '@stylistic/eslint-plugin-js';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['.eslintrc.js', 'dist/**/*', 'src/migrations/*'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      import: importPlugin,
      '@stylistic/js': stylisticJsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...typescriptEslintPlugin.configs['eslint-recommended'].rules,
      ...typescriptEslintPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z0-9]',
            match: true,
          },
        },
        {
          selector: ['class'],
          format: ['PascalCase'],
        },
        {
          selector: ['variable'],
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          filter: {
            regex: '(conflict_target|skip_empty_lines)',
            match: false,
          },
        },
        {
          selector: ['function', 'method', 'parameter'],
          format: ['camelCase'],
          filter: {
            regex: '(BooleanTransformer)',
            match: false,
          },
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      '@stylistic/js/indent': [
        'error',
        2,
        {
          ignoredNodes: ['PropertyDefinition'],
          SwitchCase: 1,
          ignoreComments: false,
        },
      ],
      'linebreak-style': 'off',
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'no-unneeded-ternary': 2,
      'no-console': 2,
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'key-spacing': ['error', { mode: 'strict' }],
      'keyword-spacing': 2,
      'arrow-spacing': 2,
      'space-infix-ops': 2,
      'spaced-comment': 2,
      'no-multiple-empty-lines': ['error', { max: 2 }],
      'no-var': 2,
      'one-var': ['error', 'never'],
      'prefer-const': 2,
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['sibling', 'parent', 'index']],
          pathGroups: [
            {
              pattern: '@nestjs/**',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '@root/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@test/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'never',
        },
      ],
    },
  },
  {
    files: ['**/*.js'],
    ignores: ['dist/**/*'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    files: ['src/app/core/constants/index.ts'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['parameter', 'method'],
          format: ['camelCase', 'UPPER_CASE'],
        },
      ],
    },
  },
];
