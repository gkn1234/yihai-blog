<script setup lang="ts">
const l = ref<number[]>([])

function a() {
  l.value.push(1)
}
</script>

<template>
  <div flex="~ justify-between items-center gap-3" h="full">
    <!-- Logo + 网站标题 -->
    <NuxtLink
      to="/"
      flex="~ items-center grow gap-2"
      w="0"
      font="bold"
      c="t-primary hover:t-muted"
      no-underline
      transition="colors 150"
    >
      <span class="i-mdi-cloud-outline w-7 h-7 text-accent" />
      <span class="text-lg tracking-wide">{{ $t('site.title') }}</span>
    </NuxtLink>

    <!-- 导航区 -->
    <div flex="shrink-0">
      111
    </div>

    <!-- 功能区 -->
    <div flex="~ justify-end items-center grow gap-2" w="0">
      222
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
