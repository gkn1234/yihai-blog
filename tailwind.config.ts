import type { Config } from 'tailwindcss'

/**
 * Tailwind CSS v4 配置文件
 *
 * 这个文件主要用于 IDE 支持（如 VS Code Tailwind CSS IntelliSense）
 * 实际的主题配置在 src/app/(frontend)/globals.css 中使用 @theme 指令
 */
const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
}

export default config
