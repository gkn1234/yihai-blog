import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import antfu from '@antfu/eslint-config'
import tailwindcss from 'eslint-plugin-tailwindcss'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default antfu({
  ignores: [
    'src/payload-types.ts',
  ],
  react: true,
  nextjs: true,
}).append(tailwindcss.configs['flat/recommended'], {
  settings: {
    tailwindcss: {
      config: resolve(__dirname, 'tailwind.config.js'),
    },
  },
  rules: {
    'tailwindcss/no-custom-classname': 'off',
  },
})
