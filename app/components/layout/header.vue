<script setup lang="ts">
const { t } = useI18n()

// 滚动隐藏/显示逻辑
const isHidden = ref(false)
const lastScrollY = ref(0)
const scrollThreshold = 100

function handleScroll() {
  if (!import.meta.client)
    return

  const currentScrollY = window.scrollY

  // 向上滚动时显示
  if (currentScrollY < lastScrollY.value) {
    isHidden.value = false
  }
  // 向下滚动且超过阈值时隐藏
  else if (currentScrollY > lastScrollY.value && currentScrollY > scrollThreshold) {
    isHidden.value = true
  }

  lastScrollY.value = currentScrollY
}

// 移动端菜单状态
const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 导航项
const navItems = computed(() => [
  { path: '/', label: t('nav.home') },
  { path: '/blog', label: t('nav.blog') },
])
</script>

<template>
  <header
    class="layout-header"
    :class="{ 'is-hidden': isHidden }"
  >
    <div class="header-container">
      <!-- Logo + 网站标题 -->
      <NuxtLink to="/" class="logo-link">
        <span class="logo-icon i-mdi-cloud-outline" />
        <span class="site-title">{{ t('site.title') }}</span>
      </NuxtLink>

      <!-- 桌面端导航 -->
      <nav class="nav-desktop">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          active-class="is-active"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- 功能区 -->
      <div class="header-actions">
        <!-- i18n 切换下拉 -->
        <LayoutLocaleDropdown />

        <!-- 主题切换按钮 - 预留位置 -->
        <!-- <button class="action-btn">
          <span class="i-mdi-theme-light-dark" />
        </button> -->
      </div>

      <!-- 移动端汉堡菜单按钮 -->
      <button
        class="menu-toggle"
        :aria-expanded="isMobileMenuOpen"
        aria-label="Toggle menu"
        @click="toggleMobileMenu"
      >
        <span class="hamburger-icon" :class="{ 'is-open': isMobileMenuOpen }">
          <span />
          <span />
          <span />
        </span>
      </button>
    </div>
  </header>

  <!-- 移动端侧边栏菜单 -->
  <LayoutMobileMenu
    :is-open="isMobileMenuOpen"
    :nav-items="navItems"
    @close="closeMobileMenu"
  />
</template>

<style lang="scss" scoped>
.layout-header {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  width: 100%;
  height: var(--header-height);
  background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
  transition: transform var(--transition-normal);

  &.is-hidden {
    transform: translateY(-100%);
  }
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--container-max-width);
  height: 100%;
  padding: 0 var(--container-padding);
  margin: 0 auto;
}

// Logo
.logo-link {
  display: flex;
  gap: 8px;
  align-items: center;
  font-weight: 600;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--color-accent);
  }
}

.logo-icon {
  width: 28px;
  height: 28px;
  color: var(--color-accent);
}

.site-title {
  font-size: 1.125rem;
  letter-spacing: 0.02em;
}

// Desktop Navigation
.nav-desktop {
  display: none;
  gap: 8px;
  align-items: center;

  @media (width >= 768px) {
    display: flex;
  }
}

.nav-link {
  padding: 8px 16px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast);

  &:hover {
    color: var(--color-text-primary);
    background-color: var(--color-accent-light);
  }

  &.is-active {
    color: var(--color-accent);
  }
}

// Header Actions
.header-actions {
  display: none;
  gap: 8px;
  align-items: center;

  @media (width >= 768px) {
    display: flex;
  }
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--color-text-secondary);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition:
    color var(--transition-fast),
    border-color var(--transition-fast),
    background-color var(--transition-fast);

  &:hover {
    color: var(--color-text-primary);
    background-color: var(--color-bg-secondary);
    border-color: var(--color-border-hover);
  }

  span {
    width: 20px;
    height: 20px;
  }
}

// Mobile Menu Toggle
.menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: none;

  @media (width >= 768px) {
    display: none;
  }
}

.hamburger-icon {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
  width: 22px;
  height: 22px;

  span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: var(--color-text-primary);
    border-radius: 2px;
    transition:
      transform var(--transition-fast),
      opacity var(--transition-fast);
  }

  &.is-open {
    span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
  }
}
</style>
