import defineConfig from './dist/index.mjs'

export default defineConfig({
  js: true,
  ts: true,
  vue: true,
  stylistic: true,
  importx: true,
  ignores: ['dist/*', 'node_modules/*'],
  globals: {
    ref: true,
  },
})
