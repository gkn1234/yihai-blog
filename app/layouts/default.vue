<script setup lang="ts">
</script>

<template>
  <div class="app-layout">
    <LayoutHeader />

    <main class="main-content">
      <slot />
    </main>

    <LayoutFooter />
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: var(--container-max-width);
  padding: var(--container-padding);
  margin: 0 auto;
}
</style>

