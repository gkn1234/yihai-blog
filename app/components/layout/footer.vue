<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="w-full py-6 border-t border-border">
    <div class="container-base text-center">
      <p class="text-sm text-text-muted">
        © {{ currentYear }} 云深亦知梦. All rights reserved.
      </p>
    </div>
  </footer>
</template>
