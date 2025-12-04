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
    <DropdownMenuTrigger
      class="locale-trigger"
      :aria-label="t('locale.switch')"
    >
      <span class="i-mdi-translate w-4.5 h-4.5" />
      <span class="min-w-6 text-center">{{ locale.toUpperCase() }}</span>
      <span class="i-mdi-chevron-down w-4 h-4 transition-transform duration-fast chevron-icon" />
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
          <span class="font-500">{{ loc.name }}</span>
          <span class="text-xs text-text-muted">{{ loc.code.toUpperCase() }}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style lang="scss" scoped>
.locale-trigger {
  --uno: flex items-center gap-1.5 px-3 py-2 text-sm font-500;
  --uno: text-text-secondary bg-transparent cursor-pointer;
  --uno: border border-solid border-border rounded-md;
  --uno: transition-all duration-fast;

  &:hover {
    --uno: text-text-primary bg-bg-secondary border-border-hover;
  }

  &[data-state="open"] {
    --uno: text-text-primary bg-bg-secondary border-border-hover;

    .chevron-icon {
      transform: rotate(180deg);
    }
  }
}

.locale-content {
  z-index: var(--z-dropdown);
  min-width: 140px;
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

.locale-item {
  --uno: flex items-center justify-between gap-2 px-3 py-2.5;
  --uno: text-sm text-text-primary cursor-pointer outline-none rounded;
  --uno: transition-colors duration-fast;

  &:hover,
  &[data-highlighted] {
    --uno: bg-accent-light;
  }
}
</style>
