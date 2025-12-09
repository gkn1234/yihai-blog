---
name: 博客 LayoutHeader 实现计划
overview: ""
todos:
  - id: d231edc2-e0cd-46ef-bf7e-b506e29b3d7e
    content: 安装 @nuxtjs/i18n 并配置 nuxt.config.ts
    status: pending
  - id: 04cc85c4-6e24-45b7-b31e-9a3b1d137484
    content: 创建 i18n 翻译文件 (zh.json, en.json)
    status: pending
  - id: b3c08f74-a7e9-4c01-9c6f-cf1a19d07aec
    content: 在 vars.scss 中定义主题 CSS 变量
    status: pending
  - id: c8b51209-a193-48bc-8928-edaa3ceea15a
    content: 实现 header.vue 主组件（结构 + 滚动逻辑）
    status: pending
  - id: d6f53c94-9ccd-4642-b474-3a3b2a1b5a9e
    content: 实现 LocaleDropdown.vue 语言切换下拉
    status: pending
  - id: 896e82f7-85e9-432f-9e49-7cc226bb7b5b
    content: 实现 MobileMenu.vue 移动端侧边栏
    status: pending
  - id: aeb9ed12-c976-4913-802e-9fc9f5a49ef8
    content: 在 default.vue 中集成 Header 组件
    status: pending
---

# 博客 LayoutHeader 实现计划

## 需求概览

- **位置**: `app/components/layout/header.vue`
- **网站标题**: 云深亦知梦
- **导航项**: 首页、博客
- **功能**: i18n 下拉切换、深色/浅色主题切换预留位置、响应式汉堡菜单
- **交互**: 向下滚动隐藏、向上滚动显示

## 技术栈

- UnoCSS (presetWind4) 用于样式
- @vueuse/core 用于滚动检测
- @nuxtjs/i18n 用于国际化
- reka-ui 用于下拉菜单组件

## 实现步骤

### 1. 安装并配置 @nuxtjs/i18n

```ts
// nuxt.config.ts 新增
modules: ['@nuxtjs/i18n'],
i18n: {
  defaultLocale: 'zh',
  locales: [
    { code: 'zh', name: '中文', file: 'zh.json' },
    { code: 'en', name: 'English', file: 'en.json' }
  ],
  strategy: 'prefix_except_default'
}
```

创建翻译文件: `i18n/locales/zh.json` 和 `i18n/locales/en.json`

### 2. 定义 CSS 变量 (`app/assets/styles/vars.scss`)

```scss
:root {
  --header-height: 64px;
  --header-bg: rgba(255, 255, 255, 0.8);
  --text-primary: #1a1a1a;
  --text-secondary: #666;
  --border-color: rgba(0, 0, 0, 0.1);
  // ... 更多变量
}

.dark {
  --header-bg: rgba(24, 24, 28, 0.8);
  --text-primary: #f5f5f5;
  // ...
}
```

### 3. 实现 Header 组件核心结构

```vue
<template>
  <header class="layout-header" :class="{ 'is-hidden': isHidden }">
    <div class="header-container">
      <!-- Logo + 标题 -->
      <NuxtLink to="/" class="logo">
        <span class="logo-icon">...</span>
        <span class="site-title">云深亦知梦</span>
      </NuxtLink>
      
      <!-- 桌面端导航 -->
      <nav class="nav-desktop">
        <NuxtLink to="/">{{ $t('nav.home') }}</NuxtLink>
        <NuxtLink to="/blog">{{ $t('nav.blog') }}</NuxtLink>
      </nav>
      
      <!-- 功能区：i18n 切换 + 主题切换预留 -->
      <div class="header-actions">
        <LocaleDropdown />
        <!-- 主题切换预留位置 -->
      </div>
      
      <!-- 移动端汉堡菜单按钮 -->
      <button class="menu-toggle" @click="toggleMenu">...</button>
    </div>
  </header>
  
  <!-- 移动端侧边栏 -->
  <MobileMenu v-model="isMenuOpen" />
</template>
```

### 4. 滚动隐藏/显示逻辑

使用 `@vueuse/core` 的 `useScroll`:

```ts
const { y, directions } = useScroll(document)
const isHidden = ref(false)
const lastY = ref(0)

watch(y, (newY) => {
  if (directions.top) {
    isHidden.value = false // 向上滚动显示
  } else if (directions.bottom && newY > 100) {
    isHidden.value = true  // 向下滚动隐藏
  }
})
```

### 5. 新增/修改文件清单

| 文件 | 操作 |

|------|------|

| `app/components/layout/header.vue` | 创建主组件 |

| `app/components/layout/LocaleDropdown.vue` | 创建 i18n 下拉组件 |

| `app/components/layout/MobileMenu.vue` | 创建移动端菜单 |

| `app/assets/styles/vars.scss` | 添加主题变量 |

| `nuxt.config.ts` | 添加 i18n 配置 |

| `i18n/locales/zh.json` | 中文翻译文件 |

| `i18n/locales/en.json` | 英文翻译文件 |

| `app/layout/default.vue` | 引入 Header 组件 |