import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const config = [
  {
    files: ['**/*.js', '**/*.ts'],
    ignores: ['dist/**/*'],
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    ...eslint.configs.recommended,
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  ...tseslint.configs.recommendedTypeChecked.map((c) => ({
    ...c,
    files: ['**/*.ts'],
  })),
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off'
    }
  },
];

export default config;
