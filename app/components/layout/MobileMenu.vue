<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'

interface NavItem {
  path: string
  label: string
}

const props = defineProps<{
  isOpen: boolean
  navItems: NavItem[]
}>()

const emit = defineEmits<{
  close: []
}>()

const { locale, locales, setLocale, t } = useI18n()

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})

function handleLocaleChange(code: string) {
  setLocale(code)
}

function handleNavClick() {
  emit('close')
}

// 防止滚动穿透
watch(() => props.isOpen, (isOpen) => {
  if (import.meta.client) {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <!-- 遮罩层 -->
    <Transition name="overlay">
      <div
        v-if="isOpen"
        class="mobile-overlay"
        @click="emit('close')"
      />
    </Transition>

    <!-- 侧边栏 -->
    <Transition name="slide">
      <aside v-if="isOpen" class="mobile-menu">
        <div class="mobile-menu-header">
          <span class="site-title">{{ t('site.title') }}</span>
        </div>

        <nav class="mobile-nav">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="mobile-nav-link"
            active-class="is-active"
            @click="handleNavClick"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="mobile-menu-footer">
          <!-- i18n 切换 -->
          <DropdownMenuRoot>
            <DropdownMenuTrigger class="locale-trigger-mobile">
              <span class="i-mdi-translate" />
              <span>{{ t('locale.switch') }}</span>
              <span class="i-mdi-chevron-down chevron-icon" />
            </DropdownMenuTrigger>

            <DropdownMenuPortal>
              <DropdownMenuContent
                class="locale-content-mobile"
                :side-offset="8"
              >
                <DropdownMenuItem
                  v-for="loc in availableLocales"
                  :key="loc.code"
                  class="locale-item-mobile"
                  @click="handleLocaleChange(loc.code)"
                >
                  <span class="locale-name">{{ loc.name }}</span>
                  <span class="locale-code">{{ loc.code.toUpperCase() }}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenuRoot>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  background: rgb(0 0 0 / 50%);
  backdrop-filter: blur(4px);
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-mobile-menu);
  display: flex;
  flex-direction: column;
  width: 280px;
  max-width: 85vw;
  background: var(--color-bg);
  box-shadow: var(--shadow-lg);
}

.mobile-menu-header {
  display: flex;
  align-items: center;
  height: var(--header-height);
  padding: 0 20px;
  border-bottom: 1px solid var(--color-border);
}

.site-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.mobile-nav {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  padding: 16px 12px;
  overflow-y: auto;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast);

  &:hover {
    color: var(--color-text-primary);
    background-color: var(--color-bg-secondary);
  }

  &.is-active {
    color: var(--color-accent);
    background-color: var(--color-accent-light);
  }
}

.mobile-menu-footer {
  padding: 16px;
  border-top: 1px solid var(--color-border);
}

// Locale dropdown in mobile
.locale-trigger-mobile {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition:
    color var(--transition-fast),
    border-color var(--transition-fast);

  &:hover {
    color: var(--color-text-primary);
    border-color: var(--color-border-hover);
  }

  &[data-state="open"] {
    color: var(--color-text-primary);
    border-color: var(--color-border-hover);

    .chevron-icon {
      transform: rotate(180deg);
    }
  }

  span:first-child {
    width: 20px;
    height: 20px;
  }

  span:nth-child(2) {
    flex: 1;
    text-align: left;
  }
}

.chevron-icon {
  width: 18px;
  height: 18px;
  margin-left: auto;
  transition: transform var(--transition-fast);
}

.locale-content-mobile {
  z-index: calc(var(--z-mobile-menu) + 10);
  min-width: 200px;
  padding: 6px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  transform-origin: var(--reka-dropdown-menu-content-transform-origin);
  animation: dropdown-in 0.15s ease-out;
}

@keyframes dropdown-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-4px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.locale-item-mobile {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  font-size: 0.9375rem;
  color: var(--color-text-primary);
  cursor: pointer;
  outline: none;
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast);

  &:hover,
  &[data-highlighted] {
    background-color: var(--color-accent-light);
  }
}

.locale-name {
  font-weight: 500;
}

.locale-code {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

// Transitions
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity var(--transition-normal);
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform var(--transition-normal);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>

