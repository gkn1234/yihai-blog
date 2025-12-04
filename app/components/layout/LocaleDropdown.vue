<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'

const { locale, locales, setLocale, t } = useI18n()

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})

function handleLocaleChange(code: string) {
  setLocale(code)
}
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger class="locale-trigger" :aria-label="t('locale.switch')">
      <span class="i-mdi-translate" />
      <span class="locale-current">{{ locale.toUpperCase() }}</span>
      <span class="i-mdi-chevron-down chevron-icon" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        class="locale-content"
        :side-offset="8"
        align="end"
      >
        <DropdownMenuItem
          v-for="loc in availableLocales"
          :key="loc.code"
          class="locale-item"
          @click="handleLocaleChange(loc.code)"
        >
          <span class="locale-name">{{ loc.name }}</span>
          <span class="locale-code">{{ loc.code.toUpperCase() }}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style lang="scss" scoped>
.locale-trigger {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: 500;
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

  &[data-state="open"] {
    color: var(--color-text-primary);
    background-color: var(--color-bg-secondary);
    border-color: var(--color-border-hover);

    .chevron-icon {
      transform: rotate(180deg);
    }
  }

  span:first-child {
    width: 18px;
    height: 18px;
  }
}

.locale-current {
  min-width: 24px;
  text-align: center;
}

.chevron-icon {
  width: 16px;
  height: 16px;
  transition: transform var(--transition-fast);
}

.locale-content {
  z-index: var(--z-dropdown);
  min-width: 140px;
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

.locale-item {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  font-size: 0.875rem;
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
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>

