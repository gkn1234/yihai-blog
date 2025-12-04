<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="layout-footer">
    <div class="footer-container">
      <p class="copyright">
        © {{ currentYear }} 云深亦知梦. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.layout-footer {
  width: 100%;
  padding: 24px 0;
  border-top: 1px solid var(--color-border);
}

.footer-container {
  max-width: var(--container-max-width);
  padding: 0 var(--container-padding);
  margin: 0 auto;
  text-align: center;
}

.copyright {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
</style>

