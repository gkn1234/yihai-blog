import antfu from '@antfu/eslint-config'
import tailwindcss from 'eslint-plugin-tailwindcss'

export default antfu({
  react: true,
  nextjs: true,
}).append({
  plugins: {
    tailwindcss,
  },
  rules: {

  },
})
