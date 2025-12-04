<script setup lang="ts">
const routeBaseName = useRouteBaseName()
const { locale } = useI18n()
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage
        keepalive
        :page-key="route => `${String(routeBaseName(route))}-${locale}`"
      />
    </NuxtLayout>
  </div>
</template>
