<script setup lang="ts">
// 滚动隐藏/显示逻辑
const isHidden = ref(false)
let lastScrollY = 0
const scrollThreshold = 100

function handleScroll() {
  if (!import.meta.client)
    return

  const currentScrollY = window.scrollY

  // 向上滚动时显示
  if (currentScrollY < lastScrollY) {
    isHidden.value = false
  }
  // 向下滚动且超过阈值时隐藏
  else if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
    isHidden.value = true
  }

  lastScrollY = currentScrollY
}

useEventListener('scroll', handleScroll)
</script>

<template>
  <header
    class="header"
    :class="{ 'translate-y--100%': isHidden }"
  >
    <UiMediaQueryView h="full">
      <LayoutHeaderPcNav />
      <template #mobile>
        <LayoutHeaderMobileNav />
      </template>
    </UiMediaQueryView>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  width: 100%;
  height: 4rem;
  padding-inline: 1.5rem;
  background: var(--background);
  border-bottom: 1px solid var(--border);
  transition: translate 250ms ease;
}
</style>
