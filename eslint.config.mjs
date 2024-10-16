import defineConfig from 'eslint-config-airbe'

export default defineConfig({
  js: {
    'no-use-before-define': 'off',
    'no-console': 'off',
  },
  ts: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-redundant-type-constituents': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    't@typescript-eslint/no-explicit-any': 'off',
  },
  stylistic: true,
  importx: true,
  ignores: ['**/dist/*', '**/node_modules/*', 'packages/playground/**'],
}, {
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ['*.{js,mjs}', 'tsconfig.json', 'package.json'],
      },
    },
  },
})
