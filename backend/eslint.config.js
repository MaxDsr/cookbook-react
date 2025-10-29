import eslint from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'
import unicorn from 'eslint-plugin-unicorn'
import prettierConfig from 'eslint-config-prettier'

export default [
  {
    ignores: ['node_modules/**', 'public/**', 'dist/**']
  },
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        Buffer: 'readonly',
        NodeJS: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
      import: importPlugin,
      unicorn: unicorn
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'arrow-parens': ['error', 'as-needed'],
      'space-in-parens': ['error', 'never'],
      'no-promise-executor-return': 'error',
      'object-curly-spacing': ['error', 'always'],
      'computed-property-spacing': ['error', 'never'],
      'array-bracket-spacing': ['error', 'never'],
      'space-unary-ops': 'error',
      'comma-spacing': ['error', { before: false, after: true }],
      'comma-style': ['error', 'last'],
      'space-infix-ops': ['error', { int32Hint: false }],
      'keyword-spacing': ['error', { before: true }],
      'prefer-arrow-callback': 'error',
      'no-sequences': 'error',
      'quote-props': ['error', 'as-needed'],
      'jsx-quotes': ['error', 'prefer-double'],
      'no-console': 'error',
      'no-multi-spaces': 'error',
      'padded-blocks': ['error', 'never'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'key-spacing': ['error', { beforeColon: false }],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      'no-await-in-loop': 'error',
      'comma-dangle': ['error', 'never'],
      'no-trailing-spaces': 'error',
      indent: ['error', 2, { SwitchCase: 1 }],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'unicorn/filename-case': ['error', { case: 'camelCase' }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error'
    }
  },
  prettierConfig
]

