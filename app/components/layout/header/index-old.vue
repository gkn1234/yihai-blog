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
    class="header-root"
    :class="{ 'translate-y--100%': isHidden }"
  >
    <div class="container-base h-full flex items-center justify-between">
      <!-- Logo + 网站标题 -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2 font-600 text-text-primary no-underline transition-colors duration-fast hover:text-accent"
      >
        <span class="i-mdi-cloud-outline w-7 h-7 text-accent" />
        <span class="text-lg tracking-wide">{{ t('site.title') }}</span>
      </NuxtLink>

      <!-- 桌面端导航 -->
      <nav class="hidden md:flex items-center gap-2">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          active-class="!text-accent"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- 功能区 -->
      <div class="hidden md:flex items-center gap-2">
        <LayoutHeaderLocaleDropdown />
      </div>

      <!-- 移动端汉堡菜单按钮 -->
      <button
        class="md:hidden flex items-center justify-center w-10 h-10 p-0 bg-transparent border-none cursor-pointer"
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
  <LayoutHeaderMobileMenu
    :is-open="isMobileMenuOpen"
    :nav-items="navItems"
    @close="closeMobileMenu"
  />
</template>

<style lang="scss" scoped>
.header-root {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  width: 100%;
  height: var(--header-height);
  background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
  transition: translate 250ms ease;

  &.is-hidden {
    transform: translateY(-100%);
  }
}

.nav-link {
  --uno: px-4 py-2 text-sm font-500 text-text-secondary no-underline rounded-md;
  --uno: transition-colors duration-fast;
  --uno: hover:text-text-primary hover:bg-accent-light;
}

// 汉堡菜单图标（动画复杂，保留自定义样式）
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
      transform 150ms ease,
      opacity 150ms ease;
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
