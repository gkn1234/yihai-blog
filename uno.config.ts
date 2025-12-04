import transformerDirectives from '@unocss/transformer-directives'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind4,
} from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify({
      ignoreAttributes: [
        ':size',
        'color',
      ],
    }),
    presetIcons({
      collections: {
        // Material Design Icons
        mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
  theme: {
    colors: {
      // 基础颜色通过 CSS 变量实现深色模式切换
      bg: {
        DEFAULT: 'var(--color-bg)',
        secondary: 'var(--color-bg-secondary)',
        elevated: 'var(--color-bg-elevated)',
      },
      t: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
      },
      border: {
        DEFAULT: 'var(--color-border)',
        hover: 'var(--color-border-hover)',
      },
      accent: {
        DEFAULT: 'var(--color-accent)',
        hover: 'var(--color-accent-hover)',
        light: 'var(--color-accent-light)',
      },
    },
    // 扩展阴影
    boxShadow: {
      sm: 'var(--shadow-sm)',
      md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)',
    },
    // 扩展过渡时间
    transitionDuration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
    },
    // 扩展圆角
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
    },
  },
  // 自定义快捷方式
  shortcuts: {
    // 布局容器
    'container': 'w-100% max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding)]',
    // 按钮基础样式
    'btn-base': 'inline-flex items-center justify-center cursor-pointer transition-all duration-fast',
    // 悬浮效果
    'hover-accent': 'hover:text-accent hover:bg-accent-light',
  },
})
