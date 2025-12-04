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
        class="fixed inset-0 z-[var(--z-overlay)] bg-black/50 backdrop-blur-sm"
        @click="emit('close')"
      />
    </Transition>

    <!-- 侧边栏 -->
    <Transition name="slide">
      <aside
        v-if="isOpen"
        class="mobile-menu"
      >
        <div class="flex items-center h-[var(--header-height)] px-5 border-b border-border">
          <span class="text-lg font-600 text-text-primary">{{ t('site.title') }}</span>
        </div>

        <nav class="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="mobile-nav-link"
            active-class="!text-accent !bg-accent-light"
            @click="handleNavClick"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="p-4 border-t border-border">
          <!-- i18n 切换 -->
          <DropdownMenuRoot>
            <DropdownMenuTrigger class="locale-trigger-mobile">
              <span class="i-mdi-translate w-5 h-5" />
              <span class="flex-1 text-left">{{ t('locale.switch') }}</span>
              <span class="i-mdi-chevron-down w-4.5 h-4.5 ml-auto transition-transform duration-fast chevron-icon" />
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
                  <span class="font-500">{{ loc.name }}</span>
                  <span class="text-sm text-text-muted">{{ loc.code.toUpperCase() }}</span>
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

.mobile-nav-link {
  --uno: flex items-center px-4 py-3.5 text-base font-500;
  --uno: text-text-secondary no-underline rounded-md;
  --uno: transition-colors duration-fast;
  --uno: hover:text-text-primary hover:bg-bg-secondary;
}

.locale-trigger-mobile {
  --uno: flex items-center gap-2 w-full px-4 py-3 text-base font-500;
  --uno: text-text-secondary bg-bg-secondary cursor-pointer;
  --uno: border border-solid border-border rounded-md;
  --uno: transition-colors duration-fast;

  &:hover {
    --uno: text-text-primary border-border-hover;
  }

  &[data-state="open"] {
    --uno: text-text-primary border-border-hover;

    .chevron-icon {
      transform: rotate(180deg);
    }
  }
}

.locale-content-mobile {
  z-index: calc(var(--z-mobile-menu) + 10);
  min-width: 200px;
  padding: 6px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  transform-origin: var(--reka-dropdown-menu-content-transform-origin);
  animation: dropdown-in 150ms ease-out;
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
  --uno: flex items-center justify-between gap-2 px-3.5 py-3;
  --uno: text-base text-text-primary cursor-pointer outline-none rounded;
  --uno: transition-colors duration-fast;

  &:hover,
  &[data-highlighted] {
    --uno: bg-accent-light;
  }
}

// Transitions
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 250ms ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 250ms ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
